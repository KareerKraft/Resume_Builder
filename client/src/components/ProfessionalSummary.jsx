import React from "react"
import { Sparkles } from "lucide-react"

const ProfessionalSummary = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Sparkles className="size-5 text-purple-600" />
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>
      </div>

      {/* Textarea */}
      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg
          focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none
          transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummary
