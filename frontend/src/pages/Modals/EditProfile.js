import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTweetData } from '../../Datacontext/TweetData';

const EditProfile = () => {
    // Access the 'auth' object from the TweetData context
    const { auth } = useTweetData();

    // State to store the selected file for profile photo upload
    const [file, setFile] = useState();

    // Function to send a POST request to the backend to upload the profile photo
    const sendPostRequestToBackendToUploadProfilePhoto = async () => {
        // Check if a file has been selected
        if (!file) {
            return toast.error('Please upload a file');
        }

        // Create a new FormData object to send the file to the backend
        const formData = new FormData();
        formData.append('file', file?.data);

        try {
            // Send the POST request to upload the profile photo
            const { data } = await axios.post('/user/uploadProfilePicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
            
                },
            });

            console.log(data);

            // If there is an error in the response, show a toast error message
            if (data?.error) {
                toast.error(data?.error);
            } else {
                // If successful, log the image URL and refresh the page to update the profile photo
                console.log(data?.imgURL);
                window.location.reload();
            }
        } catch (error) {
            // Handle any errors that occur during the upload process
            console.error('Error uploading profile photo:', error);
        }
    };

    // Function to handle the file input change event and update the 'file' state
    const handleChange = (e) => {
        console.log('from edit profile file change');
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        };
        console.log(e.target.files[0]);
        setFile(img);
    };

    return (
        <>
            {/* Modal for uploading the profile photo */}
            <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Upload Your Photo</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {/* File input to select the profile photo */}
                            <input type="file" onChange={handleChange} className="new-tweet" cols="60" rows="5" placeholder="Add your reply" />
                        </div>
                        <div class="upload-image-div">
                            <i class="fa-regular fa-image"></i>
                        </div>
                        {/* Show a preview of the selected image */}
                        {file?.preview && <img style={{ margin: '0 auto' }} src={file?.preview} width="100%" height="310px" />}
                        <div class="modal-footer">
                            {/* Close button for the modal */}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            {/* Upload button to trigger the profile photo upload */}
                            <button type="button" data-bs-dismiss="modal" onClick={sendPostRequestToBackendToUploadProfilePhoto} class="btn btn-primary tweet-btn-2">
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
