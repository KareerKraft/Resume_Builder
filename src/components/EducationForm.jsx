 import React from "react"
import { Plus, Trash2, GraduationCap } from "lucide-react"

const EducationForm = ({ data = [], onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    }
    onChange([...data, newEducation])
  }

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateEducation = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <GraduationCap className="size-5 text-green-600" />
            Education
          </h3>
          <p className="text-sm text-gray-500">
            Add your education details
          </p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 space-y-2">
          <GraduationCap className="mx-auto size-6" />
          <p className="text-sm">
            Click “Add Education” to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Institution */}
              <input
                value={education.institution || ""}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                type="text"
                placeholder="Institution Name"
                className="px-3 py-2 text-sm border rounded-lg w-full"
              />

              {/* Degree & Field */}
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className="px-3 py-2 text-sm border rounded-lg"
                />

                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of Study"
                  className="px-3 py-2 text-sm border rounded-lg"
                />
              </div>

              {/* Graduation Date & GPA */}
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm border rounded-lg"
                />

                <input
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  type="text"
                  placeholder="GPA (optional)"
                  className="px-3 py-2 text-sm border rounded-lg"
                />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm
