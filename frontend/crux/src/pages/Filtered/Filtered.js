import React ,{useState, useEffect} from 'react';
import "./Filtered.css"
import Navbar from "../../components/Navbar/Navbar"
import ProfileList from "../../components/ProfileList/ProfileList"

function Filtered() {
    const [profileList, setProfileList] = useState([])
    const [recommendedProfilesList, setRecommendedProfileList] = useState([])
    const [nonRecommendedProfilesList, setNonRecommendedProfileList] = useState([])

    var storedData = localStorage.getItem('responseData');
    console.log(storedData);
    var responseData = JSON.parse(storedData);
    const jsonArray = Object.values(responseData);
    console.log(jsonArray);

    const number = jsonArray.length;


    useEffect(()=>{
    setProfileList(jsonArray);
    const recommendedProfiles = profileList.filter(profile => profile.relevance_score > 80);
    const nonRecommendedProfiles = profileList.filter(profile => profile.relevance_score <= 80);
    setRecommendedProfileList(recommendedProfiles);
    setNonRecommendedProfileList(nonRecommendedProfiles);

    },[])

    return (


        <>
        <Navbar/>
        <div className='Main'>
            <div className="ProfileSection" itemID='ProfileSection'>
                <div className="ProfileContent">
                    <div className="SectionHeader">
                        <div className='SectionHeader-Content'>
                            <div className='SectionHeader-Content-Text'>
                                <div className='SectionHeader-Content-Text-1'>{number} Resumes filtered</div>
                                <div className='SectionHeader-Content-Text-2'>Purpose Selection</div>
                            </div>
                        </div>
                        <img src = "/images/Divider.png" alt="divider" className='Divider'></img>
                    </div>
                    <div className='SectionBody'>
                        <div className='RecommendedProfiles'>
                            <div className='RecommendedProfiles-Label'>
                                <div className='RecommendedProfiles-Label-Text-1 overflow-hidden'>Recommended Profiles</div>
                                <div className='RecommendedProfiles-Label-Text-2 overflow-hidden'>Resumes fit for the Job role</div>
                            </div>
                            <div className='RecommendedProfiles-Table'>
                                <div className='RecommendedProfiles-Table-Header'>
                                    <div className='RecommendedProfiles-Table-Header-Label ' style={{width:'40%'}}>Name</div>
                                    <div className='RecommendedProfiles-Table-Header-Label ' style={{width:'30%'}}>Relevance Score</div>
                                    <div className='RecommendedProfiles-Table-Header-Label ' style={{width:'30%'}}>Resume Link</div>
                                </div>
                                <div className='RecommendedProfiles-Table-Body'>
                                    <ProfileList profiles={profileList}/>
                                </div>
                            </div>
                        </div>
                        <div className='nonRecommendedProfiles'>
                            <div className='nonRecommendedProfiles-Label'>
                                <div className='nonRecommendedProfiles-Label-Text-1 overflow-hidden'>Non - Recommended Profiles</div>
                                <div className='nonRecommendedProfiles-Label-Text-2 overflow-hidden'>Resumes that don't fit for the Job role</div>
                            </div>
                            <div className='nonRecommendedProfiles-Table'>
                                <div className='nonRecommendedProfiles-Table-Header'>
                                    <div className='nonRecommendedProfiles-Table-Header-Label ' style={{width:'40%'}}>Name</div>
                                    <div className='nonRecommendedProfiles-Table-Header-Label ' style={{width:'30%'}}>Relevance Score</div>
                                    <div className='nonRecommendedProfiles-Table-Header-Label ' style={{width:'30%'}}>Resume Link</div>
                                </div>
                                <div className='nonRecommendedProfiles-Table-Body'>
                                    <ProfileList profiles={profileList}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Filtered;


