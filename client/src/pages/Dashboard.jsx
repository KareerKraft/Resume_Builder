import React, { useEffect, useState } from "react"
import { PlusIcon, UploadCloudIcon, UploadCloud, FilePenLineIcon, TrashIcon, PencilIcon, XIcon, } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from 'react-hot-toast';
import axios from "axios";
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

    const { user, token } = useSelector(state => state.auth);



    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

    const [allResumes, setAllResumes] = useState([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState("")
    const [resume, setResume] = useState(null)
    const [editResumeId, setEditResumeId] = useState("")

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const loadAllResumes = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/users/resumes', {
                headers: {
                    Authorization: token
                }
            });
            setAllResumes(data.resumes);
        } catch (error) {
             toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        loadAllResumes()
    }, [])

    const createResume = async (event) => {
        try {
            event.preventDefault()
            const { data } = await axios.post('http://localhost:3000/api/resumes/create', { title }, {
                headers: {
                    Authorization: token
                }
            });
            setAllResumes([...allResumes, data.resume])
            setTitle('')
            setShowCreateResume(false)
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }
    const uploadResume = async (event) => {
        event.preventDefault()
        setIsLoading(true);
        try {
            const resumeText = await pdfToText(resume)
            const { data } = await axios.post('http://localhost:3000/api/ai/upload-resume', { title, resumeText }, {
                headers: {
                    Authorization: token
                }
            });
            setTitle('')
            setResume(null)
            setShowUploadResume(false)
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
        setIsLoading(false)
    }
    const editTitle = async (e) => {
        e.preventDefault()
        setEditResumeId("")
        setTitle("")
    }
    const deleteResume = async (resumeId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resume?"
        )
        if (confirmDelete) {
            setAllResumes((prev) =>
                prev.filter((resume) => resume._id !== resumeId)
            )
        }
    }

    return (
        <div>
            {/* CREATE / UPLOAD SECTION */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
                    Welcome, Joe Doe
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => setShowCreateResume(true)}
                        className="w-full bg-white h-56 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                        <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
                        <p className="text-sm group-hover:text-indigo-600">
                            Create Resume
                        </p>
                    </button>

                    <button
                        onClick={() => setShowUploadResume(true)}
                        className="w-full bg-white h-56 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                        <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
                        <p className="text-sm group-hover:text-purple-600">
                            Upload Existing
                        </p>
                    </button>
                </div>
            </div>

            <hr className="border-slate-300 my-6 sm:w-[305px] mx-auto" />

            {/* RESUME CARDS */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 px-4 max-w-7xl mx-auto">
                {allResumes.map((resume, index) => {
                    const baseColor = colors[index % colors.length]

                    return (
                        <button
                            key={index}
                            onClick={() =>
                                navigate(`/app/builder/${resume._id}`)
                            }
                            className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{
                                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                                borderColor: baseColor + "40",
                            }}
                        >
                            <FilePenLineIcon
                                className="size-7 group-hover:scale-105"
                                style={{ color: baseColor }}
                            />

                            <p
                                className="text-sm group-hover:scale-105 px-2 text-center"
                                style={{ color: baseColor }}
                            >
                                {resume.title}
                            </p>

                            <p
                                className="absolute bottom-1 text-[11px] px-2 text-center"
                                style={{ color: baseColor }}
                            >
                                Updated on{" "}
                                {new Date(
                                    resume.updatedAt
                                ).toLocaleDateString()}
                            </p>

                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                            >
                                <TrashIcon
                                    onClick={() =>
                                        deleteResume(resume._id)
                                    }
                                    className="size-7 p-1.5 hover:bg-white/50 rounded"
                                />
                                <PencilIcon
                                    onClick={() => {
                                        setEditResumeId(resume._id)
                                        setTitle(resume.title)
                                    }}
                                    className="size-7 p-1.5 hover:bg-white/50 rounded"
                                />
                            </div>
                        </button>
                    )
                })}
            </div>
            {showCreateResume && (
                <form
                    onSubmit={createResume}
                    onClick={() => setShowCreateResume(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-slate-50 rounded-lg w-full max-w-sm p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Create a Resume
                        </h2>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Enter resume title"
                            className="w-full px-4 py-2 mb-4 border rounded"
                            required
                        />

                        <button className="w-full py-2 bg-green-600 text-white rounded">
                            Create Resume
                        </button>

                        <XIcon className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setShowCreateResume(false)
                                setTitle("")
                            }}
                        />
                    </div>
                </form>
            )}

            {showUploadResume && (
                <form
                    onSubmit={uploadResume}
                    onClick={() => setShowUploadResume(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-slate-50 rounded-lg w-full max-w-sm p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Upload Resume
                        </h2>

                        <label className="block text-sm text-slate-700">
                            Select resume file
                        </label>

                        <div
                            onClick={() =>
                                document
                                    .getElementById("resume-input")
                                    .click()
                            }
                            className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 py-10 my-4 cursor-pointer"
                        >
                            {resume ? (
                                <p className="text-green-700">
                                    {resume.name}
                                </p>
                            ) : (
                                <>
                                    <UploadCloud className="size-14" />
                                    <p>Upload resume</p>
                                </>
                            )}

                            <input
                                id="resume-input"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setResume(e.target.files[0])
                                }
                                required
                            />
                        </div>

                        <button className="w-full py-2 bg-green-600 text-white rounded">
                            Upload Resume
                        </button>

                        <XIcon
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setShowUploadResume(false)
                                setTitle("")
                            }}
                        />
                    </div>
                </form>
            )}

            {editResumeId && (
                <form
                    onSubmit={editTitle}
                    onClick={() => setEditResumeId("")}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-slate-50 rounded-lg w-full max-w-sm p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Edit Resume Title
                        </h2>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="w-full px-4 py-2 mb-4 border rounded"
                            required
                        />

                        <button className="w-full py-2 bg-green-600 text-white rounded">
                            Update
                        </button>

                        <XIcon
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setEditResumeId("")
                                setTitle("")
                            }}
                        />
                    </div>
                </form>
            )}
        </div>
    )
}

export default Dashboard
