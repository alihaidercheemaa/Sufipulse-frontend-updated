"use client"

import { useState } from "react"
import { Mic, Headphones, Radio, Wifi, Save } from "lucide-react"
import { SmartField, SmartTextArea, SmartSelect, SmartToggle, FieldGroup, Alert } from "@/components/ui"

export default function EquipmentPage() {
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    // Recording Environment
    recordingEnvironment: "Professional Studio",
    hasHomeStudio: true,
    
    // Equipment
    microphone: "",
    audioInterface: "",
    headphones: "",
    daw: "",
    
    // Technical Specs
    sampleRate: "44.1 kHz",
    bitDepth: "24-bit",
    internetSpeed: "",
    
    // Additional Info
    acousticTreatment: "",
    backupEquipment: "",
    additionalNotes: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would save to API
    console.log("Saving equipment profile:", formData)
    setSuccess("Equipment profile saved successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const ENVIRONMENT_OPTIONS = [
    { value: "Professional Studio", label: "Professional Studio" },
    { value: "Condenser Mic Setup", label: "Condenser Mic Setup" },
    { value: "USB Microphone", label: "USB Microphone" },
    { value: "Mobile Setup", label: "Mobile Setup" },
  ]

  const SAMPLE_RATE_OPTIONS = [
    { value: "44.1 kHz", label: "44.1 kHz (CD Quality)" },
    { value: "48 kHz", label: "48 kHz (Video Standard)" },
    { value: "96 kHz", label: "96 kHz (High Resolution)" },
  ]

  const BIT_DEPTH_OPTIONS = [
    { value: "16-bit", label: "16-bit (CD Quality)" },
    { value: "24-bit", label: "24-bit (Professional)" },
    { value: "32-bit float", label: "32-bit Float (Maximum Dynamic Range)" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Equipment Profile</h1>
              <p className="text-blue-100 text-sm">Your technical setup for recording sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert type="success" title="Success" message={success} onClose={() => setSuccess("")} />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recording Environment */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Recording Environment</h3>
              <p className="text-sm text-slate-500">Describe your primary recording setup</p>
            </div>

            <FieldGroup title="Environment" icon={Radio}>
              <SmartSelect
                label="Primary Recording Environment"
                name="recordingEnvironment"
                value={formData.recordingEnvironment}
                onChange={handleInputChange}
                options={ENVIRONMENT_OPTIONS}
              />
              <SmartToggle
                label="Home Studio Available"
                description="I have a dedicated home studio setup"
                name="hasHomeStudio"
                checked={formData.hasHomeStudio}
                onChange={(checked) => handleToggleChange("hasHomeStudio", checked)}
              />
              <div className="md:col-span-2">
                <SmartTextArea
                  label="Acoustic Treatment"
                  name="acousticTreatment"
                  value={formData.acousticTreatment}
                  onChange={handleInputChange}
                  placeholder="Describe any acoustic treatment in your recording space..."
                  rows={3}
                />
              </div>
            </FieldGroup>
          </div>

          {/* Equipment */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Equipment</h3>
              <p className="text-sm text-slate-500">List your recording equipment</p>
            </div>

            <FieldGroup title="Hardware & Software" icon={Headphones}>
              <SmartField
                label="Microphone(s)"
                name="microphone"
                value={formData.microphone}
                onChange={handleInputChange}
                placeholder="e.g., Neumann U87, Shure SM7B"
                icon={Mic}
              />
              <SmartField
                label="Audio Interface"
                name="audioInterface"
                value={formData.audioInterface}
                onChange={handleInputChange}
                placeholder="e.g., Universal Audio Apollo, Focusrite Scarlett"
                icon={Radio}
              />
              <SmartField
                label="Headphones"
                name="headphones"
                value={formData.headphones}
                onChange={handleInputChange}
                placeholder="e.g., Beyerdynamic DT 770, Sennheiser HD 650"
                icon={Headphones}
              />
              <SmartField
                label="DAW (Digital Audio Workstation)"
                name="daw"
                value={formData.daw}
                onChange={handleInputChange}
                placeholder="e.g., Pro Tools, Logic Pro, Ableton Live"
                icon={Wifi}
              />
              <div className="md:col-span-2">
                <SmartTextArea
                  label="Backup Equipment"
                  name="backupEquipment"
                  value={formData.backupEquipment}
                  onChange={handleInputChange}
                  placeholder="List any backup equipment available..."
                  rows={3}
                />
              </div>
            </FieldGroup>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Technical Specifications</h3>
              <p className="text-sm text-slate-500">Your standard recording specifications</p>
            </div>

            <FieldGroup title="Audio Quality" icon={Mic}>
              <SmartSelect
                label="Sample Rate"
                name="sampleRate"
                value={formData.sampleRate}
                onChange={handleInputChange}
                options={SAMPLE_RATE_OPTIONS}
              />
              <SmartSelect
                label="Bit Depth"
                name="bitDepth"
                value={formData.bitDepth}
                onChange={handleInputChange}
                options={BIT_DEPTH_OPTIONS}
              />
              <SmartField
                label="Internet Speed"
                name="internetSpeed"
                value={formData.internetSpeed}
                onChange={handleInputChange}
                placeholder="e.g., 100 Mbps download / 20 Mbps upload"
                icon={Wifi}
              />
            </FieldGroup>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Additional Information</h3>
              <p className="text-sm text-slate-500">Any other relevant details</p>
            </div>

            <div>
              <SmartTextArea
                label="Additional Notes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Share any additional information about your setup, preferences, or requirements..."
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              Save Equipment Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
