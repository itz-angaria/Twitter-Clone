import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../Datacontext/AuthData';
import '../Modals/EditDetail.css';

const EditDetail = ({ currentUser }) => {
    // Object to hold user profile details for editing
    const userProfileDetailsObject = {
        name: '',
        location: '',
        date_of_birth: '',
    };

    // State to manage user profile details
    const [userProfileDetails, setUserProfileDetails] = useState(userProfileDetailsObject);
    const [auth, setAuth] = useAuth();

    // Destructure user profile details for easy access
    const [name, setName] = useState(currentUser?.user?.name);
    const [location, setLocation] = useState(currentUser?.user?.location);
    const [date_of_birth, setDate_of_birth] = useState(currentUser?.user?.DateOfBirth);

    // Handle changes in the input fields
    const handleChange = (e) => {
        e.preventDefault();
        setUserProfileDetails({ ...userProfileDetails, [e.target.name]: e.target.value });
    };

    // Send request to update profile details in the backend
    const sendRequestToBackendToUpdateProfileDetails = async (id) => {
        console.log(userProfileDetails);
        const { data } = await axios.post(`/user/updateUserProfileDetails/${id}`, {
            name,
            location,
            date_of_birth,
        });

        if (data?.error) {
            return toast.error(data?.error);
        }

        if (data?.user) {
            // Reset the user profile details object and update authentication data
            setUserProfileDetails(userProfileDetailsObject);
            localStorage.setItem('auth', JSON.stringify(data));
            window.location.reload();
            console.log(data);
        }
    };

    return (
        // Modal for updating user profile details
        <div class="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Profile Details</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {/* Input field for name */}
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>Name</label>
                        <input
                            className="new-tweet"
                            value={name}
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            cols="60"
                            rows="5"
                            placeholder="Name"
                        />
                    </div>
                    {/* Input field for location */}
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>Location</label>
                        <input
                            className="new-tweet"
                            value={location}
                            name="location"
                            onChange={(e) => setLocation(e.target.value)}
                            cols="60"
                            rows="5"
                            placeholder="Location"
                        />
                    </div>
                    {/* Input field for date of birth */}
                    <div class="modal-body d-flex align-items-center gap-3 fs-4">
                        <label>DOB</label>
                        <input
                            className="new-tweet"
                            value={date_of_birth}
                            onChange={(e) => setDate_of_birth(e.target.value)}
                            name="date_of_birth"
                            type="date"
                            cols="60"
                            rows="5"
                            placeholder="Add your reply"
                        />
                    </div>
                    <div class="upload-image-div">
                        <i class="fa-regular fa-image"></i>
                    </div>
                    {/* Modal footer with buttons */}
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary tweet-btn-2"
                            data-bs-dismiss="modal"
                            onClick={() => sendRequestToBackendToUpdateProfileDetails(auth?.user?.userId)}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDetail;
