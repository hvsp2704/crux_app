from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, HttpResponse
import fitz, os
from dotenv import load_dotenv
from openai import OpenAI
import  os, json, time, json
from .models import Profile, College, WorkExperience, Skill, Certification, Project, TimeDuration, Certification
# from helper_functions import convert_to_text, get_openai_response

def wait_timer(seconds):
    print(f"Waiting for {seconds} seconds...")
    time.sleep(seconds)
    print("Timer expired!")

@csrf_exempt
def shorlist(request):

    pdf_files = request.FILES.getlist('files')
    print(pdf_files)
    # wait_timer(30)
    extracted_data = {}

    job_role = request.POST["job_role"]
    job_description = request.POST["job_description"]
    # print(job_role)
    # print(job_description)
    current_path = os.path.dirname(__file__)
    input_directory = os.path.join(current_path, 'resumes')
    # output_directory = os.path.join(current_path, 'extracted_data')
    
    with open(os.path.join(current_path, 'json_sample.json'), 'r') as file:
        json_sample = json.load(file)

    
    systemprompt = f""" Imagine you're a recruiter searching for an ideal candidate. Your goal is to evaluate candidates based on their skills, experiences, and education to determine their suitability for a given job role.
    Begin by examining the skills required for the job and assess whether the candidate possesses these skills.
    Consider the relevance of the candidate's experiences and education to the job requirements. Determine the significance of their learning experiences based on the alignment with the job role or description.
    Key Considerations:
    Skills Assessment: Evaluate the candidate's proficiency in the required skills for the job role.
    Experience Relevancy: Assess the relevance of the candidate's past experiences to the job responsibilities and requirements.
    Education Alignment: Determine the alignment of the candidate's educational background with the demands of the job role, focusing on the relevance of learned content to the job.
    Objective:
    Provide an evaluation of each candidate's suitability for the given job role. Consider the holistic match between the candidate's profile and the job requirements, ensuring a thorough assessment based on skills, experience relevancy, and educational alignment."""

    file_count = 0

    for pdf_file in pdf_files:

        file_count += 1
        print(f"Processing File {file_count}/{len(pdf_files)} - {pdf_file}")
        
        pdf_to_text(pdf_file,input_directory)
        # Construct the full path of the PDF file
        txt_file_name = os.path.splitext(os.path.basename(pdf_file.name))[0] + ".txt"
        txt_file_path = os.path.join(input_directory, txt_file_name)

        with open(txt_file_path, 'r', encoding='utf-8') as f:
            pdf_text = f.read()

        userprompt = f"""Task: Extract details from the text of a resume enclosed within angle brackets and format them into a JSON structure. If any details are missing, use the placeholder 'Unknown'.
        The JSON structure should resemble the keys delimited by triple backticks in the provided example, allowing for multiple entries in each section.
        For the Education section, ensure granular details where 'education level' refers to the degree level (e.g., Bachelors, Masters, PhD) and 'specialization' refers to the major or course name.
        Example:
        json
        {json_sample}
        PDF Text: <{pdf_text}>

        After extracting the details, consider the provided job role and job description:
        Job Role: {job_role}
        Job Description: {job_description}
        For each entry in every section, assess its relevance to the job role and description by assigning a relevancy score out of 100. This score should reflect how well the candidate's skills align with the job requirements, considering whether these skills have been acquired or practiced in the specific entry. Take sufficient time to ensure accuracy and avoid premature conclusions.
        Dont't hallucinate, keep the job role in mind at all times. Also esure that all the relevancy fields and cgpa of college should be integer or float not text."""

        start_time = time.time()
        response = get_openai_response(userprompt=userprompt,systemprompt=systemprompt)
        end_time = time.time()

        execution_time = end_time - start_time
        print(f"Response received in {execution_time:.2f} seconds")

        # file_name = os.path.splitext(pdf_file)[0]
        # json_file_path = os.path.join(output_directory, file_name)
        # with open(json_file_path, 'w', encoding='utf-8') as f:
        #         f.write(response)



        if(response[0]=="`"):
            responseData = json.loads(remove_first_and_last_line(response))
            # print(responseData)
            profileID = save_profile_details(responseData,pdf_file)
            relScore = calc_relScore(profileID)
            extracted_data[str(profileID)] = get_profile_info(profileID, relScore)
        else:
            responseData = json.loads(response)
            # print(responseData)
            profileID = save_profile_details(responseData,pdf_file)
            relScore = calc_relScore(profileID)

            extracted_data[str(profileID)] = get_profile_info(profileID, relScore)
            
    response = JsonResponse(extracted_data, status=200)

    for filename in os.listdir(input_directory):
            file_path = os.path.join(input_directory, filename)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"Removed file: {file_path}")
            except Exception as e:
                print(f"Error removing file {file_path}: {e}")

    return response

load_dotenv()
API_KEY = os.getenv('API_KEY')


def calc_relScore(id):
    profile_id = id
    try:
        profile = Profile.objects.get(pk=profile_id)
        
        # Calculate average relevance for skills
        skills_relevance_sum = profile.skillRelevancy
        num_skills = profile.skills.count()
        average_skills_relevance = skills_relevance_sum / num_skills if num_skills > 0 else 0
        
        # Calculate average relevance for certifications
        certifications_relevance_sum = sum(certification.relevancy for certification in profile.certifications.all())
        num_certifications = profile.certifications.count()
        average_certifications_relevance = certifications_relevance_sum / num_certifications if num_certifications > 0 else 0
        
        # Calculate average relevance for projects
        projects_relevance_sum = sum(project.relevancy for project in profile.projects.all())
        num_projects = profile.projects.count()
        average_projects_relevance = projects_relevance_sum / num_projects if num_projects > 0 else 0
        
        # Calculate average relevance for work experiences
        work_experiences_relevance_sum = sum(experience.relevancy for experience in profile.work_experience.all())
        num_work_experiences = profile.work_experience.count()
        average_work_experiences_relevance = work_experiences_relevance_sum / num_work_experiences if num_work_experiences > 0 else 0
        
        # Calculate average relevance for college
        average_college_relevance = profile.college.relevancy
        total_relevance_sum = (skills_relevance_sum + certifications_relevance_sum + 
                               projects_relevance_sum + work_experiences_relevance_sum + 
                               average_college_relevance)
        total_num_items = (num_skills + num_certifications + num_projects + 
                           num_work_experiences + 1)  # Adding 1 for college
        overall_average_relevance = total_relevance_sum / total_num_items if total_num_items > 0 else 0
        # Return average relevance scores for each section
        return int(overall_average_relevance)
    except Profile.DoesNotExist:
        return None

def get_profile_info(profile_id, relevance_score):
    try:
        profile = Profile.objects.get(id=profile_id)
        return {"id" : profile_id,'name': profile.name, 'email': profile.email, 'relevance_score': relevance_score}
    except Profile.DoesNotExist:
        return {'error': 'Profile with the given ID does not exist.'}

def convert_to_text(pdf_files, input_directory):
    for pdf_file in pdf_files:
        pdf_to_text(pdf_file,input_directory)

def pdf_to_text(pdf_file, output_directory):
    # pdf_document = fitz.open(pdf_file)
    pdf_document = fitz.open(stream=pdf_file.read(), filetype="pdf")
    full_text = ""
    for page in pdf_document:
        full_text += page.get_text()
    pdf_document.close()

    # Handle and remove special characters
    full_text = full_text.replace("\u2022", " ")  # Bullet
    full_text = full_text.replace("\u25cf", " ")  # Black Circle
    full_text = full_text.replace("\u25cb", " ")  # White Circle
    full_text = full_text.replace('\u2019', "'")  # Apostrophe
    full_text = full_text.replace('\u2013', '-')  # Hyphen or Dash
    full_text = full_text.replace('\ufffd', '')   # Unknown special character

    # Generate the output .txt file name based on the PDF file name
    txt_file_name = os.path.splitext(os.path.basename(pdf_file.name))[0] + ".txt"

    # Save the extracted text to a new .txt file in the specified output directory
    txt_file_path = os.path.join(output_directory, txt_file_name)
    with open(txt_file_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
        print(f"Writing txt file for {txt_file_name}")

    return txt_file_path

def get_openai_response(userprompt, systemprompt, model="gpt-3.5-turbo", temperature=0): 
    client = OpenAI(api_key = API_KEY)
    response = client.chat.completions.create(
    model=model,
    messages = [{"role": "user", "content": userprompt},
                {"role": "system", "content": systemprompt}
                ],
    temperature=temperature, 
    )
    return response.choices[0].message.content

def remove_first_and_last_line(text):
    lines = text.split('\n')
    if len(lines) >= 2:
        return '\n'.join(lines[1:-1])
    else:
        return ""

def replace_unknown(data):
    if isinstance(data, dict):
        return {k: replace_unknown(v) if v != "Unknown" else "Not available" for k, v in data.items()}
    elif isinstance(data, list):
        return [replace_unknown(item) if item != "Unknown" else "Not available" for item in data]
    else:
        return data

def save_profile_details(json_data, resume_file):

    data = json_data
    data = replace_unknown(data)

    # Extract profile details from JSON
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    linkedin_url = data.get('linkedin URL')
    github_url = data.get('github URL')
    college_data = data.get('college', {})
    work_experience_data = data.get('work_experience', [])
    skills_data = data.get('skills', {}).get('list', [])
    certifications_data = data.get('certifications', [])
    projects_data = data.get('projects', [])
    extracurricular_activities = data.get('extracurricular_activities', [])

    # Create or update college
    college, _ = College.objects.update_or_create(
        name=college_data.get('name'),
        defaults={
            'branch': college_data.get('branch'),
            'degree': college_data.get('degree'),
            'cgpa': college_data.get('cgpa'),
            'start': college_data.get('start'),
            'end': college_data.get('end'),
            'relevancy': college_data.get('relevancy')
        }
    )

    # Create or update work experiences
    work_experiences = []
    for exp_data in work_experience_data:
        time_duration_data = exp_data.get('time_duration', {})
        time_duration, _ = TimeDuration.objects.get_or_create(
            start=time_duration_data.get('start'),
            end=time_duration_data.get('end'),
            duration_months=time_duration_data.get('duration_months')
        )

        work_exp, _ = WorkExperience.objects.update_or_create(
            role=exp_data.get('role'),
            organization=exp_data.get('organization'),
            short_description=exp_data.get('short_description'),
            tech_stack=', '.join(exp_data.get('tech_stack', [])),
            time_duration=time_duration,
            relevancy=exp_data.get('relevancy')
        )
        work_experiences.append(work_exp)

    # Create or update skills
    skills_objs = [Skill.objects.get_or_create(name=skill)[0] for skill in skills_data]

    # Create or update certifications
    certifications = []
    for cert_data in certifications_data:
        cert, _ = Certification.objects.get_or_create(
            name=cert_data.get('certification_name'),
            provider=cert_data.get('provider'),
            defaults={'grade': cert_data.get('grade')},
            relevancy = cert_data.get('relevancy')
        )
        certifications.append(cert)

    # Create or update projects
    projects = []
    for project_data in projects_data:
        time_duration_data = project_data.get('time_duration', {})
        time_duration, _ = TimeDuration.objects.get_or_create(
            start=time_duration_data.get('start'),
            end=time_duration_data.get('end'),
            duration_months=time_duration_data.get('duration_months')
        )

        project, _ = Project.objects.update_or_create(
            project_title=project_data.get('project_title'),
            defaults={
                'short_description': project_data.get('short_description'),
                'tech_stack': ', '.join(project_data.get('tech_stack', [])),
                'time_duration': time_duration,
                'relevancy': project_data.get('relevancy')
            }
        )
        projects.append(project)


    # Create profile
    profile = Profile.objects.create(
        name=name,
        email=email,
        phone=phone,
        address=address,
        linkedin_url=linkedin_url,
        github_url=github_url,
        college=college,
        extracurricular_activities=', '.join(extracurricular_activities),
        skillRelevancy = data.get('skills', {}).get('relevancy'),
        resume=resume_file
    )

    # Associate skills, certifications, projects, and work experiences with the profile
    profile.skills.add(*skills_objs)
    profile.certifications.add(*certifications)
    profile.projects.add(*projects)
    profile.work_experience.add(*work_experiences)

    return profile.id

def download_resume(request):
    # Retrieve the profile object based on the profile_id
    profile_id = request.GET.get('id')
    profile = get_object_or_404(Profile, id=profile_id)

    # Check if the profile has a resume attached
    if profile.resume:
        # Set the response content type as application/pdf
        response = HttpResponse(profile.resume, content_type='application/pdf')

        # Set the Content-Disposition header to force download the file
        response['Content-Disposition'] = f'attachment; filename="{profile.name}_resume.pdf"'

        return response
    else:
        # Return an error response if no resume is found
        return HttpResponse("Resume not found for this profile.", status=404)

def get_all_details(request):
    profile_id = request.GET.get('id')
    print(profile_id)
    try:
        
        profile = Profile.objects.get(id=profile_id)
        college = profile.college
        college_data = {
            "name" : college.name,
            "branch": college.branch,
            "degree": college.degree,
            "cgpa" : college.cgpa,
            "start" : college.start,
            "end" : college.end
        }

        projects = profile.projects.all()
        projects_data = []
        for project in projects:
            temp = {
                "project_title" : project.project_title,
                "short_description" : project.short_description,
                "tech_stack" : project.tech_stack,
            }
            projects_data.append(temp)
        
        experiences = profile.work_experience.all()
        experience_data = []
        for experience in experiences:
            temp = {
                "role" : experience.role,
                "organization" : experience.organization,
                "short_description" : experience.short_description,
                "tech_stack" : experience.tech_stack
            }
            experience_data.append(temp)
        
        profile_data = {
            "name" : profile.name,
            "email" : profile.email,
            "college" : college_data,
            "projects" : projects_data,
            "experiences" : experience_data
        }
        print("inside")
        return JsonResponse(profile_data,status=200)
    except Profile.DoesNotExist:
        return JsonResponse({'error': 'Profile with the given ID does not exist.'},status=500)

