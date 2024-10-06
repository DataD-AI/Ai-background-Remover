import React, { useState, ChangeEvent } from 'react'
import axios from 'axios'
import { Upload, Image as ImageIcon } from 'lucide-react'

function App() {
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResultUrl(null)
    }
  }

  const removeBackground = async () => {
    if (!image) return

    setLoading(true)
    const formData = new FormData()
    formData.append('image_file', image)

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY_HERE', // Replace with your actual API key
        },
        responseType: 'arraybuffer',
      })

      const blob = new Blob([response.data], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
    } catch (error) {
      console.error('Error removing background:', error)
      alert('Error removing background. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Background Remover</h1>
        
        <div className="mb-4">
          <label htmlFor="image-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload an image</span>
            </div>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}

        <button
          onClick={removeBackground}
          disabled={!image || loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            !image || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>

        {resultUrl && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <img src={resultUrl} alt="Result" className="w-full h-48 object-cover rounded-lg" />
            <a
              href={resultUrl}
              download="removed_background.png"
              className="mt-2 inline-flex items-center justify-center w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App