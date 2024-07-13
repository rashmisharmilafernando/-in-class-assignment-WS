// components/UserForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
    name: string;
    dob: string;
    picture: FileList;
    profilePicURL?: string;
}

const UserForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
    const [userData, setUserData] = useState<FormData[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://77.37.44.60:7060/users');
                if (response.status === 200) {
                    setUserData(response.data);
                } else {
                    console.error('Error fetching data', response);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchUserData();
    }, []);

    const onSubmit = async (data: FormData) => {
        if (data.picture && data.picture.length > 0) {
            data.profilePicURL = URL.createObjectURL(data.picture[0]);
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('dob', data.dob);
            formData.append('picture', data.picture[0]);

            const response = await axios.post('http://77.37.44.60:7060/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setUserData([...userData, data]);
                reset();
                setProfilePicPreview(null);
            } else {
                console.error('Error saving data', response);
            }
        } catch (error) {
            console.error('Error saving data', error);
        }
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="bg-white w-screen h-screen flex">
            <div className="w-1/2 p-8 flex flex-col m-5">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg p-8 rounded-lg bg-white shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center text-black">User Details</h1>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                        <input
                            id="date"
                            type="date"
                            {...register('dob', { required: 'DOB is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            id="profilePic"
                            type="file"
                            {...register('picture', { required: 'Profile picture is required' })}
                            onChange={handleProfilePicChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.picture && <p className="text-red-500 text-xs mt-1">{errors.picture.message}</p>}
                        {profilePicPreview && (
                            <div className="mt-2">
                                <img src={profilePicPreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover" />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </div>
            <div className="w-1/2 p-8 flex flex-col m-5">
                <h2 className="text-xl font-bold mb-4 text-center">Submitted User Data</h2>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-black">Name</th>
                            <th className="py-2 px-4 border-b text-black">Date Of Birth</th>
                            <th className="py-2 px-4 border-b text-black">Profile Picture</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b text-black">{user.name}</td>
                                <td className="py-2 px-4 border-b text-black">{user.dob}</td>
                                <td className="py-2 px-4 border-b text-black">
                                    {user.profilePicURL && (
                                        <img src={user.profilePicURL} alt="Profile" className="w-12 h-12 rounded-full object-cover mx-auto" />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserForm;
