# Complete Puter.js API Reference 
by: Primal Core

## Overview

This document provides a comprehensive reference for all Puter.js APIs and capabilities. Puter.js is a powerful JavaScript SDK that provides access to a complete cloud operating system with serverless computing, AI services, file management, user interfaces, and much more.

**Official Documentation**: [https://docs.puter.com](https://docs.puter.com)

Puter.js transforms web development by providing a unified API for:
- **Serverless Computing**: Deploy and manage cloud workers
- **Artificial Intelligence**: Chat, image generation, and OCR capabilities  
- **File System**: Complete file and directory management
- **User Interface**: Rich dialogs, pickers, and window management
- **Data Storage**: Persistent key-value storage
- **Authentication**: User management and session handling
- **Application Management**: Create and deploy web applications
- **Static Hosting**: Deploy and manage static websites
- **Networking**: CORS-free HTTP requests and socket connections
- **Development Tools**: Utilities for testing and debugging

## Core API Categories

Puter.js provides comprehensive API categories, each designed for specific functionality:

1. **[Workers API](#workers-api)** - Serverless computing and HTTP request handling
2. **[AI API](#ai-api)** - Artificial intelligence and machine learning services
3. **[File System API](#file-system-api)** - File and directory management
4. **[Key-Value Store API](#key-value-store-api)** - Persistent data storage
5. **[UI API](#ui-api)** - User interface components and dialogs
6. **[Authentication API](#authentication-api)** - User management and sessions
7. **[Apps API](#apps-api)** - Application creation and management
8. **[Hosting API](#hosting-api)** - Static website deployment
9. **[Networking API](#networking-api)** - Network connections and HTTP requests
10. **[Drivers API](#drivers-api)** - Low-level driver system access
11. **[Data Models](#data-models)** - Object structures and schemas

---

## Workers API

The Workers API provides **Serverless Computing** with router-based HTTP request handling. Workers are powerful serverless functions that can handle HTTP requests, access all Puter.js APIs, and create interactive user interfaces.

### Methods

```javascript
// Worker lifecycle management
const worker = await puter.workers.create(workerName, filePath)  // Create new worker
const worker = await puter.workers.get(workerName)               // Get worker details
const workers = await puter.workers.list()                      // List all workers
await puter.workers.delete(workerName)                          // Delete worker
const response = await puter.workers.exec(workerURL, options)   // Execute worker

// Worker execution options
const options = {
  method: 'POST',                    // HTTP method
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'example' })
}
```

### Core Concepts

- **Serverless Architecture**: Workers are serverless functions that automatically scale
- **Router-Based**: Use the `router` object to define HTTP endpoints and handlers
- **File-Based Deployment**: Workers are deployed from JavaScript files in your Puter filesystem
- **Unique URLs**: Each worker gets a unique `.puter.work` URL for external access
- **Full API Access**: Workers have complete access to all Puter.js APIs (KV, FS, AI, UI, etc.)
- **Interactive Capabilities**: Workers can create GUI interfaces and user dialogs
- **User Context**: Access user resources when called via `puter.workers.exec()`

### Data Structure

```javascript
// Worker object structure
{
  "name": "my-api",                                    // Worker name
  "url": "https://my-api.puter.work",                 // Public URL
  "file_path": "/username/Desktop/api-server.js",     // Source file path
  "file_uid": "a0d9380f-d981-4c97-96ef-d7e2e39d2a97", // File unique ID
  "created_at": "2025-08-02T23:37:16.285Z"            // Creation timestamp
}
```

### Worker Code Structure

```javascript
// Basic worker structure
router.get('/api/hello', async (event) => {
  return { message: 'Hello, World!' }
})

router.post('/api/data', async (event) => {
  const body = await event.request.json()
  
  // Access user resources (when called via puter.workers.exec)
  if (event.user?.puter) {
    await event.user.puter.kv.set('user_data', JSON.stringify(body))
  }
  
  return { success: true, data: body }
})

// Interactive worker with UI
router.get('/api/interactive', async (event) => {
  const userInput = await puter.ui.prompt('Enter your name:')
  const confirmed = await puter.ui.confirm(`Hello ${userInput}! Continue?`)
  
  if (confirmed) {
    await puter.kv.set('last_user', userInput)
    return { message: `Welcome ${userInput}!` }
  }
  
  return { message: 'Operation cancelled' }
})
```

### Use Cases

- **API Services**: Create REST APIs and microservices
- **Data Processing**: Process files, images, and data streams
- **AI Integration**: Build AI-powered applications and chatbots
- **Automation**: Create automated workflows and scheduled tasks
- **Interactive Tools**: Build tools with user interfaces and file handling
- **Integration Services**: Connect external APIs and services

---

## AI API

The AI API provides access to powerful artificial intelligence capabilities including chat completions, image generation, and optical character recognition (OCR).

### Methods

```javascript
// Chat completions - All syntax variations
const response = await puter.ai.chat(prompt)
const response = await puter.ai.chat(prompt, options)
const response = await puter.ai.chat(prompt, testMode, options)
const response = await puter.ai.chat(prompt, imageURL, testMode, options)
const response = await puter.ai.chat(prompt, [imageURLArray], testMode, options)
const response = await puter.ai.chat([messages], testMode, options)

// Image processing
const text = await puter.ai.img2txt(image, testMode)              // OCR/Image analysis
const imageDataURL = await puter.ai.txt2img(prompt, testMode)     // Image generation (basic)
const imageDataURL = await puter.ai.txt2img(prompt, options)      // Image generation (advanced)

// Text-to-speech
const audio = await puter.ai.txt2speech(text)                     // Basic TTS
const audio = await puter.ai.txt2speech(text, options)            // Advanced TTS
const audio = await puter.ai.txt2speech(text, language, voice, engine) // Full options

// Advanced options
const options = {
  model: 'gpt-5-nano',        // Model selection (500+ models available)
  stream: true,               // Streaming responses
  max_tokens: 1000,          // Token limits
  temperature: 0.7,          // Creativity control (0-2)
  tools: [functionDefs]      // Function calling capabilities
}
```

### puter.ai.chat() - Detailed Reference

**Syntax:**
```javascript
puter.ai.chat(prompt)
puter.ai.chat(prompt, options = {})
puter.ai.chat(prompt, testMode = false, options = {})
puter.ai.chat(prompt, imageURL, testMode = false, options = {})
puter.ai.chat(prompt, [imageURLArray], testMode = false, options = {})
puter.ai.chat([messages], testMode = false, options = {})
```

**Parameters:**
- `prompt` (String): The prompt you want to complete
- `options` (Object, Optional): Configuration object with properties:
  - `model` (String): Model to use (defaults to 'gpt-5-nano')
  - `stream` (Boolean): Stream the completion (defaults to false)
  - `max_tokens` (Number): Maximum tokens to generate
  - `temperature` (Number): Randomness (0-2, lower = more focused)
  - `tools` (Array): Function definitions for AI function calling
- `testMode` (Boolean, Optional): Use test API without credits (defaults to false)
- `imageURL` (String): Single image URL for vision capabilities
- `imageURLArray` (Array): Multiple image URLs for vision
- `messages` (Array): Conversation messages with roles and content

**Messages Array Format:**
```javascript
// Text-only messages
[
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello, how are you?' },
  { role: 'assistant', content: 'I am doing well, thank you!' }
]

// Multimodal messages with files
[
  {
    role: 'user',
    content: [
      { type: 'file', puter_path: '~/Desktop/document.pdf' },
      { type: 'text', text: 'Please summarize this document' }
    ]
  }
]
```

**Return Value:**
- When `stream: false` (default): Response object with `message` containing:
  - `role` (String): Who is speaking ('assistant', 'user', etc.)
  - `content` (String): The actual text response
  - `tool_calls` (Array, if function calling): Function call details
- When `stream: true`: Async iterable for streaming responses

**Function Calling:**
```javascript
const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" }
      },
      required: ["location"]
    },
    strict: false  // Optional: enforce strict parameter validation
  }
}]
```

### Available Models

Puter.js provides access to 500+ AI models including:
- **OpenAI**: GPT-5 Nano, GPT-4, DALL-E 3
- **Anthropic**: Claude Sonnet, Claude Haiku
- **Google**: Gemini 2.5 Flash, Gemini Pro
- **xAI**: Grok models
- **Mistral**: Mistral Large, Mistral Small
- **DeepSeek**: DeepSeek models
- **OpenRouter**: Access to additional models

### Complete Examples

**Basic Chat:**
```javascript
// Simple question
const response = await puter.ai.chat('What is life?', { model: 'gpt-5-nano' })
console.log(response.message.content)

// With test mode
const response = await puter.ai.chat('Hello!', true)  // Uses test API
```

**Vision Capabilities:**
```javascript
// Single image analysis
const response = await puter.ai.chat(
  'What do you see?', 
  'https://assets.puter.site/doge.jpeg',
  false,
  { model: 'gpt-5-nano' }
)

// Multiple images
const response = await puter.ai.chat(
  'Compare these images',
  ['https://image1.jpg', 'https://image2.jpg'],
  false,
  { model: 'gpt-5-nano' }
)
```

**Streaming Responses:**
```javascript
const stream = await puter.ai.chat('Tell me about Rick and Morty', {
  model: 'claude',
  stream: true
})

for await (const part of stream) {
  console.log(part?.text)  // Print each chunk as it arrives
}
```

**Function Calling:**
```javascript
// Define available functions
const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name e.g. Paris, London" }
      },
      required: ["location"]
    }
  }
}]

// Make request with tools
const completion = await puter.ai.chat("What's the weather in Paris?", { tools })

// Handle function calls
if (completion.message.tool_calls?.length > 0) {
  const toolCall = completion.message.tool_calls[0]
  
  if (toolCall.function.name === 'get_weather') {
    const args = JSON.parse(toolCall.function.arguments)
    const weatherData = getWeather(args.location)  // Your function
    
    // Send result back to AI for final response
    const finalResponse = await puter.ai.chat([
      { role: "user", content: "What's the weather in Paris?" },
      completion.message,
      { 
        role: "tool",
        tool_call_id: toolCall.id,
        content: weatherData
      }
    ])
    
    console.log(finalResponse.message.content)
  }
}
```

**Working with Files:**
```javascript
// Upload file to Puter and analyze with AI
const file = await puter.fs.write('resume.pdf', uploadedFile)

const response = await puter.ai.chat([
  {
    role: 'user',
    content: [
      { type: 'file', puter_path: file.path },
      { type: 'text', text: 'Please analyze this resume' }
    ]
  }
], false, { model: 'claude-sonnet-4' })

console.log(response.message.content)
```

### puter.ai.txt2img() - Detailed Reference

**Syntax:**
```javascript
puter.ai.txt2img(prompt, testMode = false)
puter.ai.txt2img(prompt, options = {})
```

**Parameters:**
- `prompt` (String, Required): The prompt to generate an image from
- `testMode` (Boolean, Optional): Use test API without credits (defaults to false)
- `options` (Object, Optional): Configuration object with properties:
  - `model` (String): AI model for generation - `gpt-image-1`, `gemini-2.5-flash-image-preview` (Nano Banana), or `dall-e-3` (defaults to `gpt-image-1`)
  - `quality` (String): Image quality settings:
    - For `gpt-image-1`: `high`, `medium`, or `low` (defaults to `low`)
    - For `gemini-2.5-flash-image-preview`: No quality setting available
    - For `dall-e-3`: `hd` or `standard` (defaults to `standard`)
  - `input_image` (String): Base64 encoded input image for image-to-image generation (only works with `gemini-2.5-flash-image-preview`)
  - `input_image_mime_type` (String): MIME type of input image - `image/png`, `image/jpeg`, `image/jpg`, or `image/webp` (required if `input_image` is set)

**Return Value:**
A `Promise` that resolves to an image data URL when generation is complete.

**Examples:**

```javascript
// Basic image generation with test mode
const image = await puter.ai.txt2img('A picture of a cat.', true)
document.body.appendChild(image)

// Advanced generation with specific model and quality
const image = await puter.ai.txt2img('a cat playing piano', {
  model: 'gpt-image-1',
  quality: 'low'
})
document.body.appendChild(image)

// High quality generation with DALL-E 3
const image = await puter.ai.txt2img('a futuristic cityscape', {
  model: 'dall-e-3',
  quality: 'hd'
})
document.body.appendChild(image)

// Image-to-image generation with Gemini
const image = await puter.ai.txt2img('a cat playing piano', {
  model: 'gemini-2.5-flash-image-preview',
  input_image: 'iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZ...', // Base64 image
  input_image_mime_type: 'image/png'
})
document.body.appendChild(image)
```

### Free GPT Image API Tutorial

Puter.js provides free access to OpenAI's DALL-E image generation without requiring API keys. This tutorial shows how to generate high-quality images using GPT Image models through Puter.js, perfect for creating visual content for applications, websites, and creative projects.

#### Available GPT Image Models

- **gpt-image-1**: Default GPT image generation model with quality options
- **dall-e-3**: OpenAI's most advanced image generation model

#### Getting Started with GPT Image Generation

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Image Generation

```javascript
// Simple image generation
async function generateImage() {
  try {
    const image = await puter.ai.txt2img('A serene mountain landscape at sunset', {
      model: 'gpt-image-1',
      quality: 'medium'
    })
    
    // Display the generated image
    document.body.appendChild(image)
    console.log('Image generated successfully!')
  } catch (error) {
    console.error('Image generation failed:', error)
  }
}

generateImage()
```

#### Advanced Image Generation with DALL-E 3

```javascript
// High-quality image generation with DALL-E 3
async function generateHighQualityImage() {
  const prompts = [
    'A futuristic cityscape with flying cars and neon lights',
    'A cozy coffee shop interior with warm lighting and books',
    'An abstract painting with vibrant colors and geometric shapes',
    'A magical forest with glowing mushrooms and fairy lights'
  ]
  
  for (const prompt of prompts) {
    try {
      const image = await puter.ai.txt2img(prompt, {
        model: 'dall-e-3',
        quality: 'hd'
      })
      
      // Create container for each image
      const container = document.createElement('div')
      container.style.margin = '20px'
      container.style.textAlign = 'center'
      
      const title = document.createElement('h3')
      title.textContent = prompt
      
      container.appendChild(title)
      container.appendChild(image)
      document.body.appendChild(container)
      
      console.log(`Generated: ${prompt}`)
    } catch (error) {
      console.error(`Failed to generate: ${prompt}`, error)
    }
  }
}
```

#### Interactive Image Generator

```html
<!DOCTYPE html>
<html>
<head>
  <title>GPT Image Generator</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .generator { max-width: 800px; margin: 0 auto; padding: 20px; }
    .input-section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .prompt-input { width: 100%; padding: 12px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px; }
    .controls { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .control-group label { display: block; margin-bottom: 5px; font-weight: bold; }
    .control-group select, .control-group input { width: 100%; padding: 8px; }
    .generate-btn { width: 100%; padding: 15px; background: #4caf50; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    .generate-btn:hover { background: #45a049; }
    .generate-btn:disabled { background: #ccc; cursor: not-allowed; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
    .image-card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white; }
    .image-card img { width: 100%; height: 300px; object-fit: cover; }
    .image-info { padding: 15px; }
    .image-prompt { font-weight: bold; margin-bottom: 10px; }
    .image-details { font-size: 12px; color: #666; }
    .loading { text-align: center; padding: 40px; color: #666; }
  </style>
</head>
<body>
  <div class="generator">
    <h1>GPT Image Generator</h1>
    
    <div class="input-section">
      <textarea class="prompt-input" id="image-prompt" rows="3" 
                placeholder="Describe the image you want to generate...">A beautiful sunset over a calm ocean with sailboats</textarea>
      
      <div class="controls">
        <div class="control-group">
          <label>Model:</label>
          <select id="model-select">
            <option value="gpt-image-1">GPT Image 1</option>
            <option value="dall-e-3">DALL-E 3</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Quality:</label>
          <select id="quality-select">
            <option value="low">Low (Fast)</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="hd">HD (DALL-E 3 only)</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Count:</label>
          <input type="number" id="image-count" min="1" max="4" value="1">
        </div>
      </div>
      
      <button class="generate-btn" onclick="generateImages()" id="generate-button">
        Generate Images
      </button>
    </div>
    
    <div id="gallery" class="gallery"></div>
  </div>

  <script>
    const gallery = document.getElementById('gallery')
    const generateButton = document.getElementById('generate-button')
    const promptInput = document.getElementById('image-prompt')
    const modelSelect = document.getElementById('model-select')
    const qualitySelect = document.getElementById('quality-select')
    const countInput = document.getElementById('image-count')

    async function generateImages() {
      const prompt = promptInput.value.trim()
      const model = modelSelect.value
      const quality = qualitySelect.value
      const count = parseInt(countInput.value)
      
      if (!prompt) {
        alert('Please enter a prompt')
        return
      }

      // Disable button and show loading
      generateButton.disabled = true
      generateButton.textContent = 'Generating...'
      
      // Add loading indicator
      const loadingDiv = document.createElement('div')
      loadingDiv.className = 'loading'
      loadingDiv.textContent = `Generating ${count} image(s)...`
      gallery.appendChild(loadingDiv)

      try {
        // Generate multiple images
        const promises = []
        for (let i = 0; i < count; i++) {
          promises.push(generateSingleImage(prompt, model, quality))
        }
        
        const results = await Promise.allSettled(promises)
        
        // Remove loading indicator
        gallery.removeChild(loadingDiv)
        
        // Display results
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            addImageToGallery(result.value, prompt, model, quality, index + 1)
          } else {
            console.error(`Image ${index + 1} failed:`, result.reason)
          }
        })
        
      } catch (error) {
        console.error('Generation error:', error)
        gallery.removeChild(loadingDiv)
        alert('Failed to generate images. Please try again.')
      } finally {
        // Re-enable button
        generateButton.disabled = false
        generateButton.textContent = 'Generate Images'
      }
    }

    async function generateSingleImage(prompt, model, quality) {
      const options = { model }
      
      // Set quality based on model
      if (model === 'dall-e-3') {
        options.quality = quality === 'hd' ? 'hd' : 'standard'
      } else {
        options.quality = quality
      }
      
      const startTime = Date.now()
      const image = await puter.ai.txt2img(prompt, options)
      const endTime = Date.now()
      
      return {
        image,
        generationTime: endTime - startTime
      }
    }

    function addImageToGallery(result, prompt, model, quality, index) {
      const card = document.createElement('div')
      card.className = 'image-card'
      
      card.innerHTML = `
        <img src="${result.image.src}" alt="${prompt}">
        <div class="image-info">
          <div class="image-prompt">${prompt}</div>
          <div class="image-details">
            Model: ${model} | Quality: ${quality} | Time: ${result.generationTime}ms
          </div>
        </div>
      `
      
      gallery.appendChild(card)
    }

    // Enter key support for prompt input
    promptInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        generateImages()
      }
    })
  </script>
</body>
</html>
```

#### Batch Image Generation

```javascript
// Generate multiple variations of a concept
async function generateImageVariations() {
  const basePrompt = "A modern office workspace"
  const variations = [
    "with natural lighting and plants",
    "with minimalist design and clean lines", 
    "with warm colors and cozy atmosphere",
    "with high-tech equipment and screens"
  ]
  
  console.log('Generating variations of:', basePrompt)
  
  for (let i = 0; i < variations.length; i++) {
    const fullPrompt = `${basePrompt} ${variations[i]}`
    
    try {
      const image = await puter.ai.txt2img(fullPrompt, {
        model: 'dall-e-3',
        quality: 'hd'
      })
      
      // Create labeled container
      const container = document.createElement('div')
      container.style.margin = '20px'
      container.style.display = 'inline-block'
      container.style.textAlign = 'center'
      
      const label = document.createElement('p')
      label.textContent = `Variation ${i + 1}: ${variations[i]}`
      label.style.fontWeight = 'bold'
      
      container.appendChild(label)
      container.appendChild(image)
      document.body.appendChild(container)
      
    } catch (error) {
      console.error(`Failed variation ${i + 1}:`, error)
    }
  }
}

// Generate images for different use cases
async function generateForUseCases() {
  const useCases = [
    {
      category: 'Web Design',
      prompts: [
        'Modern website hero section background with geometric patterns',
        'Clean and minimal login page background',
        'Colorful abstract background for a creative agency website'
      ]
    },
    {
      category: 'Marketing',
      prompts: [
        'Professional business team working together in modern office',
        'Product showcase with elegant lighting and shadows',
        'Social media post background with trendy colors'
      ]
    },
    {
      category: 'Content Creation',
      prompts: [
        'Blog post header image about technology trends',
        'YouTube thumbnail with bold text space and engaging visuals',
        'Podcast cover art with modern design elements'
      ]
    }
  ]
  
  for (const useCase of useCases) {
    console.log(`\nGenerating images for: ${useCase.category}`)
    
    for (const prompt of useCase.prompts) {
      try {
        const image = await puter.ai.txt2img(prompt, {
          model: 'gpt-image-1',
          quality: 'high'
        })
        
        // Create organized display
        const section = document.createElement('div')
        section.style.margin = '30px 0'
        section.style.padding = '20px'
        section.style.border = '1px solid #ddd'
        section.style.borderRadius = '8px'
        
        const categoryTitle = document.createElement('h3')
        categoryTitle.textContent = useCase.category
        categoryTitle.style.color = '#333'
        
        const promptText = document.createElement('p')
        promptText.textContent = prompt
        promptText.style.fontStyle = 'italic'
        promptText.style.color = '#666'
        
        section.appendChild(categoryTitle)
        section.appendChild(promptText)
        section.appendChild(image)
        document.body.appendChild(section)
        
      } catch (error) {
        console.error(`Failed to generate: ${prompt}`, error)
      }
    }
  }
}
```

#### GPT Image Best Practices

**Prompt Writing Tips:**
- **Be specific**: Include details about style, lighting, colors, and composition
- **Use descriptive adjectives**: "vibrant", "minimalist", "dramatic", "cozy"
- **Specify art styles**: "photorealistic", "watercolor", "digital art", "oil painting"
- **Include technical details**: "shallow depth of field", "golden hour lighting"
- **Mention composition**: "centered", "rule of thirds", "close-up", "wide angle"

**Quality Settings:**
- **Low**: Fastest generation, good for testing prompts
- **Medium**: Balanced quality and speed for most applications
- **High**: Better detail and quality for important images
- **HD (DALL-E 3)**: Highest quality for professional use

**Model Selection:**
- **Use GPT Image 1** for general image generation with quality control
- **Use DALL-E 3** for highest quality and most advanced capabilities
- **Test both models** to see which works better for your specific use case

### Free Nano Banana Tutorial (Gemini 2.5 Flash Image Generation)

Puter.js provides free access to Google's Gemini 2.5 Flash image generation (nicknamed "Nano Banana") without requiring API keys. This model excels at image-to-image generation and creative visual transformations.

#### Getting Started with Nano Banana

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Nano Banana Image Generation

```javascript
// Simple image generation with Gemini 2.5 Flash
async function generateWithNanoBanana() {
  try {
    const image = await puter.ai.txt2img('A cyberpunk cityscape with neon lights', {
      model: 'gemini-2.5-flash-image-preview'
    })
    
    document.body.appendChild(image)
    console.log('Nano Banana image generated!')
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

generateWithNanoBanana()
```

#### Image-to-Image Generation

```javascript
// Convert uploaded image to base64 for input
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data:image/...;base64, prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Image-to-image transformation
async function transformImage(inputFile, transformPrompt) {
  try {
    const base64Image = await imageToBase64(inputFile)
    const mimeType = inputFile.type
    
    const transformedImage = await puter.ai.txt2img(transformPrompt, {
      model: 'gemini-2.5-flash-image-preview',
      input_image: base64Image,
      input_image_mime_type: mimeType
    })
    
    return transformedImage
  } catch (error) {
    console.error('Image transformation failed:', error)
    throw error
  }
}

// Example usage
async function exampleImageTransformation() {
  // This would work with an actual file input
  const fileInput = document.getElementById('image-input')
  const file = fileInput.files[0]
  
  if (file) {
    const transformations = [
      'Transform this into a watercolor painting',
      'Make this look like a vintage photograph',
      'Convert this to a cartoon style illustration',
      'Transform this into a futuristic sci-fi scene'
    ]
    
    for (const transformation of transformations) {
      try {
        const result = await transformImage(file, transformation)
        
        const container = document.createElement('div')
        container.style.margin = '20px'
        container.style.textAlign = 'center'
        
        const title = document.createElement('h3')
        title.textContent = transformation
        
        container.appendChild(title)
        container.appendChild(result)
        document.body.appendChild(container)
        
      } catch (error) {
        console.error(`Failed transformation: ${transformation}`, error)
      }
    }
  }
}
```

#### Interactive Image Transformer

```html
<!DOCTYPE html>
<html>
<head>
  <title>Nano Banana Image Transformer</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .transformer { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .upload-section { border: 2px dashed #ddd; padding: 40px; text-align: center; margin-bottom: 30px; border-radius: 8px; }
    .upload-section.dragover { border-color: #4caf50; background: #f1f8e9; }
    .file-input { display: none; }
    .upload-btn { padding: 12px 24px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px; }
    .preview-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .image-preview { text-align: center; }
    .image-preview img { max-width: 100%; height: 300px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px; }
    .transform-controls { margin-bottom: 30px; }
    .transform-input { width: 100%; padding: 12px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px; }
    .transform-btn { width: 100%; padding: 15px; background: #ff9800; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    .transform-btn:disabled { background: #ccc; cursor: not-allowed; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .result-card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .result-card img { width: 100%; height: 200px; object-fit: cover; }
    .result-info { padding: 15px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="transformer">
    <h1>Nano Banana Image Transformer</h1>
    <p>Upload an image and transform it using Gemini 2.5 Flash image generation</p>
    
    <div class="upload-section" id="upload-area">
      <p>Drag and drop an image here, or click to select</p>
      <input type="file" id="file-input" class="file-input" accept="image/*">
      <button class="upload-btn" onclick="document.getElementById('file-input').click()">
        Select Image
      </button>
    </div>
    
    <div class="preview-section" id="preview-section" style="display: none;">
      <div class="image-preview">
        <h3>Original Image</h3>
        <img id="original-preview" alt="Original">
      </div>
      <div class="image-preview">
        <h3>Latest Transformation</h3>
        <img id="transformed-preview" alt="Transformed" style="display: none;">
        <p id="no-transform">No transformations yet</p>
      </div>
    </div>
    
    <div class="transform-controls" id="transform-controls" style="display: none;">
      <textarea class="transform-input" id="transform-prompt" rows="3" 
                placeholder="Describe how you want to transform the image...">Transform this into a beautiful watercolor painting with soft, flowing colors</textarea>
      <button class="transform-btn" onclick="transformCurrentImage()" id="transform-button">
        Transform Image
      </button>
    </div>
    
    <div id="results-grid" class="results-grid"></div>
  </div>

  <script>
    let currentImageFile = null
    const uploadArea = document.getElementById('upload-area')
    const fileInput = document.getElementById('file-input')
    const previewSection = document.getElementById('preview-section')
    const transformControls = document.getElementById('transform-controls')
    const originalPreview = document.getElementById('original-preview')
    const transformedPreview = document.getElementById('transformed-preview')
    const noTransformText = document.getElementById('no-transform')
    const resultsGrid = document.getElementById('results-grid')

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault()
      uploadArea.classList.add('dragover')
    })

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover')
    })

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault()
      uploadArea.classList.remove('dragover')
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleImageUpload(files[0])
      }
    })

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0])
      }
    })

    function handleImageUpload(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      currentImageFile = file
      
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        originalPreview.src = e.target.result
        previewSection.style.display = 'grid'
        transformControls.style.display = 'block'
      }
      reader.readAsDataURL(file)
    }

    function imageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    async function transformCurrentImage() {
      if (!currentImageFile) {
        alert('Please upload an image first')
        return
      }

      const prompt = document.getElementById('transform-prompt').value.trim()
      if (!prompt) {
        alert('Please enter a transformation prompt')
        return
      }

      const transformButton = document.getElementById('transform-button')
      transformButton.disabled = true
      transformButton.textContent = 'Transforming...'

      try {
        const base64Image = await imageToBase64(currentImageFile)
        
        const transformedImage = await puter.ai.txt2img(prompt, {
          model: 'gemini-2.5-flash-image-preview',
          input_image: base64Image,
          input_image_mime_type: currentImageFile.type
        })

        // Update preview
        transformedPreview.src = transformedImage.src
        transformedPreview.style.display = 'block'
        noTransformText.style.display = 'none'

        // Add to results grid
        addToResultsGrid(transformedImage, prompt)

      } catch (error) {
        console.error('Transformation failed:', error)
        alert('Transformation failed. Please try again.')
      } finally {
        transformButton.disabled = false
        transformButton.textContent = 'Transform Image'
      }
    }

    function addToResultsGrid(image, prompt) {
      const card = document.createElement('div')
      card.className = 'result-card'
      
      card.innerHTML = `
        <img src="${image.src}" alt="${prompt}">
        <div class="result-info">
          <strong>Transformation:</strong><br>
          ${prompt}
        </div>
      `
      
      resultsGrid.appendChild(card)
    }

    // Quick transformation presets
    const quickTransforms = [
      'Transform into a watercolor painting',
      'Make it look like a vintage photograph',
      'Convert to anime/manga style',
      'Transform into a oil painting masterpiece',
      'Make it look like a pencil sketch',
      'Convert to cyberpunk aesthetic'
    ]

    // Add quick transform buttons
    const quickTransformContainer = document.createElement('div')
    quickTransformContainer.style.marginBottom = '15px'
    quickTransformContainer.innerHTML = '<p><strong>Quick Transforms:</strong></p>'

    quickTransforms.forEach(transform => {
      const btn = document.createElement('button')
      btn.textContent = transform
      btn.style.margin = '5px'
      btn.style.padding = '8px 12px'
      btn.style.background = '#e0e0e0'
      btn.style.border = 'none'
      btn.style.borderRadius = '4px'
      btn.style.cursor = 'pointer'
      btn.onclick = () => {
        document.getElementById('transform-prompt').value = transform
      }
      quickTransformContainer.appendChild(btn)
    })

    document.getElementById('transform-controls').insertBefore(
      quickTransformContainer, 
      document.getElementById('transform-prompt')
    )
  </script>
</body>
</html>
```

#### Nano Banana Capabilities

**Strengths:**
- **Image-to-Image**: Excellent at transforming existing images
- **Style Transfer**: Converting images between different artistic styles
- **Creative Transformations**: Unique and creative interpretations
- **Fast Generation**: Quick processing times
- **Flexible Input**: Supports various image formats (PNG, JPEG, WebP)

**Best Use Cases:**
- **Style Transfer**: Converting photos to paintings, sketches, etc.
- **Creative Editing**: Artistic transformations and effects
- **Concept Variations**: Exploring different visual interpretations
- **Art Generation**: Creating artistic versions of photographs
- **Design Iteration**: Quickly generating design variations

### puter.ai.img2txt() - OCR and Image Analysis

The `puter.ai.img2txt()` API provides Optical Character Recognition (OCR) to extract text from images of printed text, handwriting, or any other text-based content.

**Syntax:**
```javascript
puter.ai.img2txt(image, testMode = false)
```

**Parameters:**
- `image` (String|File|Blob, Required): Image source - can be:
  - URL string (e.g., 'https://example.com/image.png')
  - Puter file path (e.g., '~/Desktop/document.jpg')
  - File object from file input
  - Blob object containing image data
- `testMode` (Boolean, Optional): Use test API without credits (defaults to false)

**Return Value:**
A `Promise` that resolves to a string containing the text extracted from the image.
In case of an error, the Promise will reject with an error message.

**Examples:**
```javascript
// Extract text from image URL
const text = await puter.ai.img2txt('https://cdn.handwrytten.com/www/2020/02/home-hero-photo2%402x.png')
console.log(text)

// Extract text from uploaded file with test mode
const text = await puter.ai.img2txt(uploadedFile, true)
console.log(text)

// Extract text from Puter file path
const text = await puter.ai.img2txt('~/Desktop/document-scan.jpg')
console.log(text)

// Using with promise chain (as shown in official docs)
puter.ai.img2txt('https://example.com/text-image.png').then(puter.print)

// Error handling
try {
  const text = await puter.ai.img2txt('invalid-image-url')
  console.log(text)
} catch (error) {
  console.error('OCR failed:', error)
}
```

**Use Cases:**
- **Document Digitization**: Convert scanned documents to editable text
- **Receipt Processing**: Extract data from receipts and invoices
- **Handwriting Recognition**: Convert handwritten notes to digital text
- **Sign Recognition**: Extract text from street signs and signage
- **Form Processing**: Digitize filled forms and applications
- **Screenshot Text**: Extract text from screenshots and images

### Free OCR API Tutorial

Need to extract text from images in your web application? Whether you're building a document scanner, digitizing receipts and business cards, or converting handwritten notes to text, this comprehensive tutorial shows how to implement OCR (Optical Character Recognition) using Puter.js. Best of all, it's completely free with no usage restrictions - no API keys or backend required.

#### Getting Started with OCR

Add Puter.js to your project with a single line:

```html
<script src="https://js.puter.com/v2/"></script>
```

That's it - you're ready to start extracting text from images.

#### Example 1: Basic Image to Text

```javascript
// Simple OCR from image URL
async function extractText() {
  const imageUrl = 'https://cdn.handwrytten.com/www/2020/02/home-hero-photo2%402x.png'
  
  try {
    const text = await puter.ai.img2txt(imageUrl)
    console.log(text || 'No text found in image')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

extractText()

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  
  <div>
    <h3>Image to Text Converter</h3>
    <input type="text" id="image-url" placeholder="Enter image URL"
           value="https://cdn.handwrytten.com/www/2020/02/home-hero-photo2%402x.png">
    <button onclick="extractText()">Extract Text</button>
    <div id="result" style="margin-top: 20px; white-space: pre-wrap;"></div>
  </div>

  <script>
    async function extractText() {
      const imageUrl = document.getElementById('image-url').value
      const resultDiv = document.getElementById('result')
      
      resultDiv.textContent = 'Processing image...'
      
      try {
        const text = await puter.ai.img2txt(imageUrl)
        resultDiv.textContent = text || 'No text found in image'
      } catch (error) {
        resultDiv.textContent = 'Error: ' + error.message
      }
    }
  </script>
</body>
</html>
*/
```

#### Example 2: File Upload OCR

```javascript
// Handle OCR for uploaded image files
async function processUploadedImage(file) {
  if (!file) {
    alert('Please select an image first')
    return
  }
  
  try {
    // Convert file to data URL
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
    
    // Process with OCR
    const text = await puter.ai.img2txt(dataUrl)
    return text || 'No text found in image'
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message)
  }
}

// Complete HTML example with file upload
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  
  <div>
    <h3>OCR File Upload</h3>
    <input type="file" id="image-input" accept="image/*">
    <button onclick="processImage()">Process Image</button>
    
    <div style="margin-top: 20px;">
      <h4>Preview:</h4>
      <img id="preview" style="max-width: 500px; display: none;">
    </div>
    
    <div style="margin-top: 20px;">
      <h4>Extracted Text:</h4>
      <div id="result" style="white-space: pre-wrap;"></div>
    </div>
  </div>

  <script>
    const imageInput = document.getElementById('image-input')
    const preview = document.getElementById('preview')
    const result = document.getElementById('result')

    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0]
      if (file) {
        preview.src = URL.createObjectURL(file)
        preview.style.display = 'block'
        result.textContent = ''
      }
    })

    async function processImage() {
      const file = imageInput.files[0]
      if (!file) {
        alert('Please select an image first')
        return
      }

      result.textContent = 'Processing image...'
      
      try {
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
        
        const text = await puter.ai.img2txt(dataUrl)
        result.textContent = text || 'No text found in image'
      } catch (error) {
        result.textContent = 'Error: ' + error.message
      }
    }
  </script>
</body>
</html>
*/
```

#### Example 3: Batch OCR Processing

```javascript
// Process multiple images and save results
let processedResults = []

// Convert File to data URL
function fileToDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

async function processBatch(files) {
  processedResults = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    console.log(`Processing image ${i + 1} of ${files.length}...`)
    
    try {
      const dataUrl = await fileToDataURL(file)
      const text = await puter.ai.img2txt(dataUrl)
      
      processedResults.push({
        filename: file.name,
        text: text,
        timestamp: new Date().toISOString()
      })
      
      console.log(`${file.name}: ${text || 'No text found'}`)
    } catch (error) {
      console.error(`${file.name}: Error - ${error.message}`)
    }
  }
  
  console.log('All images processed!')
  return processedResults
}

async function saveResults() {
  try {
    const resultsText = processedResults.map(result =>
      `File: ${result.filename}\nTimestamp: ${result.timestamp}\n\n${result.text}\n\n---\n\n`
    ).join('')
    
    await puter.fs.write('ocr-results.txt', resultsText)
    console.log('Results saved to ocr-results.txt')
  } catch (error) {
    console.error('Error saving results:', error.message)
  }
}

// Complete HTML example for batch processing
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  
  <div>
    <h3>Batch OCR Processing</h3>
    <input type="file" id="image-input" accept="image/*" multiple>
    <button onclick="processBatch()">Process All Images</button>
    
    <div id="progress"></div>
    
    <div style="margin-top: 20px;">
      <h4>Results:</h4>
      <div id="results"></div>
    </div>
    
    <button onclick="saveResults()" id="save-button" style="display: none;">
      Save Results
    </button>
  </div>

  <script>
    let processedResults = []

    function fileToDataURL(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    }

    async function processBatch() {
      const files = document.getElementById('image-input').files
      if (files.length === 0) {
        alert('Please select some images first')
        return
      }

      const progress = document.getElementById('progress')
      const results = document.getElementById('results')
      results.innerHTML = ''
      processedResults = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        progress.textContent = `Processing image ${i + 1} of ${files.length}...`

        try {
          const dataUrl = await fileToDataURL(file)
          const text = await puter.ai.img2txt(dataUrl)
          
          processedResults.push({
            filename: file.name,
            text: text,
            timestamp: new Date().toISOString()
          })

          results.innerHTML += `
            <div style="margin-bottom: 20px;">
              <strong>${file.name}</strong>
              <pre>${text || 'No text found'}</pre>
            </div>
          `
        } catch (error) {
          results.innerHTML += `
            <div style="margin-bottom: 20px; color: red;">
              <strong>${file.name}</strong>: Error - ${error.message}
            </div>
          `
        }
      }

      progress.textContent = 'All images processed!'
      document.getElementById('save-button').style.display = 'block'
    }

    async function saveResults() {
      try {
        const resultsText = processedResults.map(result =>
          `File: ${result.filename}\nTimestamp: ${result.timestamp}\n\n${result.text}\n\n---\n\n`
        ).join('')

        await puter.fs.write('ocr-results.txt', resultsText)
        alert('Results saved to ocr-results.txt')
      } catch (error) {
        alert('Error saving results: ' + error.message)
      }
    }
  </script>
</body>
</html>
*/
```

#### OCR Implementation Tips

- **Always validate input images** before processing
- **Show progress indicators** for longer operations
- **Handle errors gracefully** and provide user feedback
- **Consider image size limits** and processing time
- **Save or export results** for later use
- **Preview images** when possible to ensure correct file selection
- **Use appropriate file formats** (PNG, JPEG, WebP work best)
- **Optimize image quality** for better OCR accuracy

### puter.ai.txt2speech() - Text-to-Speech Synthesis

The `puter.ai.txt2speech()` API converts text into speech using AI with support for multiple languages, voices, and synthesis engines.

**Syntax:**
```javascript
puter.ai.txt2speech(text)
puter.ai.txt2speech(text, options)
puter.ai.txt2speech(text, language)
puter.ai.txt2speech(text, language, voice)
puter.ai.txt2speech(text, language, voice, engine)
```

**Parameters:**
- `text` (String, Required): Text to convert to speech (max 3000 characters)
- `options` (Object, Optional): Configuration object with properties:
  - `language` (String): Language code (defaults to 'en-US')
  - `voice` (String): Voice name (defaults to 'Joanna')
  - `engine` (String): Synthesis engine - 'standard', 'neural', or 'generative' (defaults to 'standard')
- `language` (String, Optional): Language code for speech synthesis
- `voice` (String, Optional): Voice name for speech synthesis
- `engine` (String, Optional): Speech synthesis engine

**Supported Languages:**
- **English**: `en-US`, `en-GB`, `en-AU`, `en-IN`, `en-NZ`, `en-ZA`, `en-GB-WLS`
- **Spanish**: `es-ES`, `es-MX`, `es-US`
- **French**: `fr-FR`, `fr-BE`, `fr-CA`
- **German**: `de-DE`, `de-AT`
- **Portuguese**: `pt-BR`, `pt-PT`
- **Chinese**: `cmn-CN` (Mandarin), `yue-CN` (Cantonese)
- **Japanese**: `ja-JP`
- **Korean**: `ko-KR`
- **Arabic**: `ar-AE`
- **Hindi**: `hi-IN`
- **Russian**: `ru-RU`
- **Italian**: `it-IT`
- **Dutch**: `nl-NL`, `nl-BE`
- **Polish**: `pl-PL`
- **Turkish**: `tr-TR`
- **Swedish**: `sv-SE`
- **Norwegian**: `nb-NO`
- **Danish**: `da-DK`
- **Finnish**: `fi-FI`
- **Icelandic**: `is-IS`
- **Romanian**: `ro-RO`
- **Catalan**: `ca-ES`
- **Welsh**: `cy-GB`

**Synthesis Engines:**
- **Standard**: Basic quality, fastest processing
- **Neural**: Higher quality, more natural sounding
- **Generative**: Highest quality, most advanced synthesis

**Return Value:**
A `Promise` that resolves to an MP3 audio stream that can be played directly.

**Examples:**

```javascript
// Basic text-to-speech
const audio = await puter.ai.txt2speech('Hello world! Puter is amazing!')
audio.play()

// With options object
const audio = await puter.ai.txt2speech('Hello world! This uses neural voice.', {
  voice: 'Joanna',
  engine: 'neural',
  language: 'en-US'
})
audio.play()

// Using positional parameters
const audio = await puter.ai.txt2speech(
  'Bonjour le monde!',
  'fr-FR',
  'Celine',
  'neural'
)
audio.play()

// Interactive button example
document.getElementById('speak-button').addEventListener('click', async () => {
  try {
    const text = document.getElementById('text-input').value
    
    if (text.length > 3000) {
      alert('Text must be less than 3000 characters!')
      return
    }
    
    const audio = await puter.ai.txt2speech(text, {
      language: 'en-US',
      voice: 'Joanna',
      engine: 'neural'
    })
    
    audio.play()
  } catch (error) {
    console.error('TTS failed:', error)
  }
})

// Multi-language example
const languages = [
  { code: 'en-US', text: 'Hello, how are you?', voice: 'Joanna' },
  { code: 'es-ES', text: 'Hola, ¿cómo estás?', voice: 'Lucia' },
  { code: 'fr-FR', text: 'Bonjour, comment allez-vous?', voice: 'Celine' },
  { code: 'de-DE', text: 'Hallo, wie geht es dir?', voice: 'Marlene' }
]

for (const lang of languages) {
  const audio = await puter.ai.txt2speech(lang.text, {
    language: lang.code,
    voice: lang.voice,
    engine: 'neural'
  })
  
  // Play each language with a delay
  setTimeout(() => audio.play(), languages.indexOf(lang) * 3000)
}
```

**Use Cases:**
- **Accessibility**: Convert text to speech for visually impaired users
- **Language Learning**: Pronunciation assistance and language practice
- **Content Creation**: Generate voiceovers for videos and presentations
- **Interactive Applications**: Voice responses in chatbots and virtual assistants
- **Audiobooks**: Convert written content to audio format
- **Notifications**: Audio alerts and announcements
- **Multilingual Support**: Provide audio content in multiple languages
- **Educational Tools**: Reading assistance and pronunciation guides

### Use Cases

- **Chatbots**: Build intelligent conversational interfaces
- **Content Generation**: Create articles, code, and creative content
- **Image Analysis**: Extract text and analyze images
- **Document Processing**: Process and analyze documents with AI
- **Code Assistance**: AI-powered code generation and review
- **Data Analysis**: Intelligent data processing and insights

### Free Grok API Alternative Tutorial

Puter.js provides free access to xAI's Grok models without requiring API keys or credits. Grok models are known for their wit, real-time information access, and unique conversational style. This tutorial shows how to use Grok models through Puter.js for building intelligent applications.

#### Available Grok Models

Puter.js provides access to multiple Grok model variants:

- **grok-beta**: Latest Grok model with enhanced capabilities
- **grok-vision-beta**: Multimodal Grok with image understanding
- **grok-2-1212**: Stable Grok 2 release with consistent performance
- **grok-2-vision-1212**: Grok 2 with vision capabilities

#### Getting Started with Grok

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Grok Chat Example

```javascript
// Simple Grok conversation
async function askGrok() {
  try {
    const response = await puter.ai.chat('What makes you different from other AI models?', {
      model: 'grok-beta'
    })
    
    console.log(response.message.content)
    // Grok's witty and engaging response style
  } catch (error) {
    console.error('Grok request failed:', error)
  }
}

askGrok()
```

#### Real-time Information with Grok

```javascript
// Grok excels at current events and real-time information
async function getCurrentNews() {
  const response = await puter.ai.chat(
    'What are the latest developments in AI technology this week?',
    { model: 'grok-beta' }
  )
  
  console.log(response.message.content)
  // Grok provides up-to-date information with sources
}

// Ask about current market conditions
async function getMarketUpdate() {
  const response = await puter.ai.chat(
    'What is happening in the cryptocurrency market today?',
    { model: 'grok-beta' }
  )
  
  console.log(response.message.content)
}
```

#### Grok Vision Capabilities

```javascript
// Analyze images with Grok Vision
async function analyzeImageWithGrok() {
  const imageUrl = 'https://example.com/chart.png'
  
  const response = await puter.ai.chat(
    'Analyze this chart and explain the trends you see',
    imageUrl,
    false,
    { model: 'grok-vision-beta' }
  )
  
  console.log(response.message.content)
  // Grok provides detailed image analysis with insights
}

// Multiple image comparison
async function compareImages() {
  const images = [
    'https://example.com/before.jpg',
    'https://example.com/after.jpg'
  ]
  
  const response = await puter.ai.chat(
    'Compare these before and after images. What changes do you notice?',
    images,
    false,
    { model: 'grok-vision-beta' }
  )
  
  console.log(response.message.content)
}
```

#### Creative Writing with Grok

```javascript
// Grok's creative and entertaining writing style
async function createStory() {
  const response = await puter.ai.chat(
    'Write a humorous short story about a programmer who discovers their code has become sentient',
    { 
      model: 'grok-beta',
      max_tokens: 1000,
      temperature: 0.8
    }
  )
  
  console.log(response.message.content)
  // Grok delivers creative, witty content
}

// Generate engaging social media content
async function createSocialPost() {
  const response = await puter.ai.chat(
    'Create an engaging Twitter thread about the future of web development',
    { model: 'grok-beta' }
  )
  
  console.log(response.message.content)
}
```

#### Technical Problem Solving with Grok

```javascript
// Grok's unique approach to problem-solving
async function debugCode() {
  const codeSnippet = `
    function calculateTotal(items) {
      let total = 0;
      for (let i = 0; i <= items.length; i++) {
        total += items[i].price;
      }
      return total;
    }
  `
  
  const response = await puter.ai.chat(
    `Find the bug in this JavaScript code and explain how to fix it:\n\n${codeSnippet}`,
    { model: 'grok-beta' }
  )
  
  console.log(response.message.content)
  // Grok provides clear debugging help with personality
}

// Architecture advice
async function getArchitectureAdvice() {
  const response = await puter.ai.chat(
    'I need to build a real-time chat application. What architecture would you recommend and why?',
    { model: 'grok-beta' }
  )
  
  console.log(response.message.content)
}
```

#### Interactive Grok Chatbot

```html
<!DOCTYPE html>
<html>
<head>
  <title>Grok Chatbot</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .chat-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .message { margin: 10px 0; padding: 10px; border-radius: 8px; }
    .user { background: #e3f2fd; text-align: right; }
    .grok { background: #f3e5f5; }
    .input-area { display: flex; gap: 10px; margin-top: 20px; }
    input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    button { padding: 10px 20px; background: #9c27b0; color: white; border: none; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="chat-container">
    <h1>Chat with Grok</h1>
    <div id="chat-messages"></div>
    <div class="input-area">
      <input type="text" id="user-input" placeholder="Ask Grok anything..." onkeypress="handleKeyPress(event)">
      <button onclick="sendMessage()">Send</button>
    </div>
  </div>

  <script>
    const chatMessages = document.getElementById('chat-messages')
    const userInput = document.getElementById('user-input')

    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement('div')
      messageDiv.className = `message ${isUser ? 'user' : 'grok'}`
      messageDiv.textContent = content
      chatMessages.appendChild(messageDiv)
      chatMessages.scrollTop = chatMessages.scrollHeight
    }

    async function sendMessage() {
      const message = userInput.value.trim()
      if (!message) return

      addMessage(message, true)
      userInput.value = ''

      try {
        const response = await puter.ai.chat(message, {
          model: 'grok-beta',
          temperature: 0.7
        })

        addMessage(response.message.content)
      } catch (error) {
        addMessage('Sorry, I encountered an error. Please try again.')
        console.error('Grok error:', error)
      }
    }

    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        sendMessage()
      }
    }

    // Welcome message
    addMessage("Hello! I'm Grok. I'm here to help with a touch of wit and access to real-time information. What would you like to know?")
  </script>
</body>
</html>
```

#### Grok Model Comparison

**Grok Beta:**
- **Witty Responses**: Known for humor and engaging conversational style
- **Real-time Information**: Access to current events and real-time data
- **Code Generation**: Strong programming and technical capabilities
- **Creative Writing**: Excellent at creative and entertaining content
- **Unique Perspective**: Offers fresh takes on complex topics
- **Problem Solving**: Unique approach to complex problem-solving

**Grok Vision Beta:**
- **Image Analysis**: Comprehensive image understanding and description
- **Chart Reading**: Excellent at interpreting graphs, charts, and data visualizations
- **Visual Problem Solving**: Can solve problems presented in visual format
- **Multimodal Understanding**: Combines text and image analysis effectively

#### When to Use Grok Models

**Choose Grok for:**
- **Creative Projects**: When you need engaging, witty content
- **Current Events**: Real-time information and news analysis
- **Technical Discussions**: Programming help with personality
- **Social Media**: Engaging content creation
- **Problem Solving**: Fresh perspectives on complex challenges
- **Entertainment**: Fun, engaging conversational experiences

**Grok Advantages:**
- **Personality**: Unique, witty conversational style
- **Real-time Data**: Access to current information
- **Engagement**: Highly engaging and entertaining responses
- **Technical Skills**: Strong programming and technical capabilities
- **Creativity**: Excellent creative writing and content generation

### Free Cohere API Alternative Tutorial

Puter.js provides free access to Cohere's powerful language models without requiring API keys or credits. Cohere models excel at text generation, summarization, classification, and retrieval-augmented generation. This tutorial shows how to use Cohere models through Puter.js.

#### Available Cohere Models

Puter.js provides access to Cohere's latest models:

- **command-r-plus**: Cohere's most capable model for complex reasoning and generation
- **command-r**: Balanced model for general-purpose text generation
- **command**: Standard Cohere model for various text tasks
- **command-light**: Faster, lightweight model for simple tasks

#### Getting Started with Cohere

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Cohere Text Generation

```javascript
// Simple text generation with Cohere
async function generateWithCohere() {
  try {
    const response = await puter.ai.chat(
      'Write a professional email introducing our new product launch',
      { model: 'command-r-plus' }
    )
    
    console.log(response.message.content)
    // High-quality, professional text generation
  } catch (error) {
    console.error('Cohere request failed:', error)
  }
}

generateWithCohere()
```

#### Advanced Text Summarization

```javascript
// Cohere excels at summarization tasks
async function summarizeDocument() {
  const longText = `
    [Your long document text here...]
    This could be a research paper, article, or any lengthy content
    that needs to be condensed into key points.
  `
  
  const response = await puter.ai.chat(
    `Please provide a concise summary of the following text, highlighting the key points:\n\n${longText}`,
    { 
      model: 'command-r-plus',
      max_tokens: 500
    }
  )
  
  console.log(response.message.content)
  // Excellent summarization with key insights
}

// Bullet point summaries
async function createBulletSummary() {
  const content = "Your content here..."
  
  const response = await puter.ai.chat(
    `Create a bullet-point summary of this content:\n\n${content}`,
    { model: 'command-r' }
  )
  
  console.log(response.message.content)
}
```

#### Text Classification with Cohere

```javascript
// Cohere is excellent for classification tasks
async function classifyText() {
  const texts = [
    "I love this product! It works perfectly.",
    "This is terrible, worst purchase ever.",
    "The item is okay, nothing special.",
    "Amazing quality and fast shipping!"
  ]
  
  for (const text of texts) {
    const response = await puter.ai.chat(
      `Classify the sentiment of this text as positive, negative, or neutral: "${text}"`,
      { model: 'command-r' }
    )
    
    console.log(`Text: ${text}`)
    console.log(`Sentiment: ${response.message.content}`)
  }
}

// Topic classification
async function classifyTopics() {
  const articles = [
    "Scientists discover new exoplanet in habitable zone",
    "Stock market reaches new highs amid economic growth",
    "New smartphone features revolutionary camera technology"
  ]
  
  const categories = ["Science", "Finance", "Technology", "Sports", "Politics"]
  
  for (const article of articles) {
    const response = await puter.ai.chat(
      `Classify this headline into one of these categories: ${categories.join(', ')}\n\nHeadline: "${article}"`,
      { model: 'command-r' }
    )
    
    console.log(`Article: ${article}`)
    console.log(`Category: ${response.message.content}`)
  }
}
```

#### Retrieval Augmented Generation (RAG)

```javascript
// Cohere excels at RAG applications
async function ragExample() {
  const knowledgeBase = `
    Company Policy Document:
    - Remote work is allowed up to 3 days per week
    - Vacation requests must be submitted 2 weeks in advance
    - Health insurance covers dental and vision
    - Annual performance reviews are conducted in December
    - Professional development budget is $2000 per employee
  `
  
  const userQuestion = "What is the remote work policy?"
  
  const response = await puter.ai.chat(
    `Based on the following company policy document, answer the user's question:

${knowledgeBase}

Question: ${userQuestion}

Please provide a clear, accurate answer based only on the information provided.`,
    { model: 'command-r-plus' }
  )
  
  console.log(response.message.content)
  // Accurate answer based on provided context
}

// Multi-document RAG
async function multiDocumentRAG() {
  const documents = [
    {
      title: "Product Manual",
      content: "The device operates at 120V and includes a 2-year warranty."
    },
    {
      title: "Safety Guidelines", 
      content: "Always unplug the device before cleaning. Use only approved cleaning solutions."
    },
    {
      title: "Troubleshooting",
      content: "If device won't start, check power connection and ensure outlet is working."
    }
  ]
  
  const question = "How do I safely clean my device?"
  
  const context = documents.map(doc => 
    `${doc.title}:\n${doc.content}`
  ).join('\n\n')
  
  const response = await puter.ai.chat(
    `Based on these documents, answer the question: "${question}"\n\n${context}`,
    { model: 'command-r-plus' }
  )
  
  console.log(response.message.content)
}
```

#### Business Content Generation

```javascript
// Cohere excels at business and professional content
async function generateBusinessContent() {
  // Marketing copy
  const marketingResponse = await puter.ai.chat(
    'Create compelling marketing copy for a new eco-friendly water bottle that keeps drinks cold for 24 hours',
    { 
      model: 'command-r-plus',
      temperature: 0.7
    }
  )
  
  console.log('Marketing Copy:', marketingResponse.message.content)
  
  // Business proposal
  const proposalResponse = await puter.ai.chat(
    'Write a business proposal for implementing a remote work policy at a traditional office company',
    { model: 'command-r-plus' }
  )
  
  console.log('Business Proposal:', proposalResponse.message.content)
  
  // Technical documentation
  const docsResponse = await puter.ai.chat(
    'Create API documentation for a user authentication endpoint that accepts email and password',
    { model: 'command-r' }
  )
  
  console.log('API Documentation:', docsResponse.message.content)
}
```

#### Multilingual Capabilities

```javascript
// Cohere supports multiple languages
async function multilingualExample() {
  const languages = [
    { code: 'es', text: 'Explica los beneficios de la energía solar' },
    { code: 'fr', text: 'Décrivez les avantages du travail à distance' },
    { code: 'de', text: 'Erklären Sie die Grundlagen des maschinellen Lernens' }
  ]
  
  for (const lang of languages) {
    const response = await puter.ai.chat(lang.text, {
      model: 'command-r-plus'
    })
    
    console.log(`Language: ${lang.code}`)
    console.log(`Response: ${response.message.content}`)
  }
}
```

#### Cohere Model Capabilities

**Command R Plus:**
- **Advanced Reasoning**: Superior logical thinking and problem-solving
- **Long Context**: Handle very long documents and conversations
- **Multilingual Processing**: Strong performance across multiple languages
- **Reasoning**: Advanced logical thinking and problem-solving
- **Business Applications**: Optimized for enterprise and business use cases
- **Retrieval Augmented Generation**: Enhanced with external knowledge integration
- **Summarization**: Excellent at condensing long content into key points
- **Classification**: Strong text classification and categorization capabilities

#### When to Use Cohere Models

**Choose Cohere for:**
- **Business Applications**: Professional content and business communications
- **Summarization**: Condensing long documents and articles
- **Classification**: Categorizing and organizing text content
- **RAG Applications**: Building knowledge-based question answering systems
- **Multilingual Tasks**: Working with multiple languages
- **Professional Writing**: High-quality business and technical writing

**Cohere Advantages:**
- **Business Focus**: Optimized for enterprise and professional use cases
- **Summarization**: Industry-leading summarization capabilities
- **Classification**: Excellent at categorizing and organizing content
- **RAG Support**: Built for retrieval-augmented generation workflows
- **Reliability**: Consistent, professional-quality outputs

### Free Kimi K2 API Alternative Tutorial

Puter.js provides free access to Moonshot AI's Kimi models without requiring API keys. Kimi models excel at multilingual understanding, long-context processing, and Chinese language tasks. This tutorial shows how to use Kimi models through Puter.js for building multilingual AI applications.

#### Available Kimi Models

Puter.js provides access to Kimi model variants:

- **moonshot-v1-8k**: Standard Kimi model with 8K context window
- **moonshot-v1-32k**: Extended context model with 32K token capacity
- **moonshot-v1-128k**: Long context model with 128K token capacity

#### Getting Started with Kimi

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Multilingual Chat

```javascript
// Kimi excels at multilingual conversations
async function multilingualChat() {
  try {
    // Chinese conversation
    const chineseResponse = await puter.ai.chat(
      '请解释人工智能的基本概念和应用领域',
      { model: 'moonshot-v1-8k' }
    )
    
    console.log('Chinese Response:', chineseResponse.message.content)
    
    // English conversation
    const englishResponse = await puter.ai.chat(
      'Explain the same concept in English with practical examples',
      { model: 'moonshot-v1-8k' }
    )
    
    console.log('English Response:', englishResponse.message.content)
  } catch (error) {
    console.error('Kimi request failed:', error)
  }
}

multilingualChat()
```

#### Long Context Processing

```javascript
// Kimi can handle very long documents
async function processLongDocument() {
  const longDocument = `
    [Insert a very long document here - up to 128K tokens]
    This could be a research paper, book chapter, legal document,
    or any lengthy content that needs analysis.
  `
  
  const response = await puter.ai.chat(
    `Please analyze this document and provide:
    1. A comprehensive summary
    2. Key themes and topics
    3. Important conclusions
    4. Any recommendations
    
    Document:
    ${longDocument}`,
    { 
      model: 'moonshot-v1-128k',
      max_tokens: 2000
    }
  )
  
  console.log(response.message.content)
  // Comprehensive analysis of long content
}

// Multi-document analysis
async function analyzeMultipleDocuments() {
  const documents = [
    "Document 1 content...",
    "Document 2 content...",
    "Document 3 content..."
  ]
  
  const combinedContent = documents.map((doc, index) => 
    `Document ${index + 1}:\n${doc}`
  ).join('\n\n---\n\n')
  
  const response = await puter.ai.chat(
    `Compare and contrast these documents, identifying common themes and differences:\n\n${combinedContent}`,
    { model: 'moonshot-v1-32k' }
  )
  
  console.log(response.message.content)
}
```

#### Chinese Language Excellence

```javascript
// Kimi's superior Chinese language capabilities
async function chineseLanguageTasks() {
  // Classical Chinese poetry analysis
  const poetryResponse = await puter.ai.chat(
    '请分析李白的《静夜思》这首诗的意境、修辞手法和文化内涵',
    { model: 'moonshot-v1-8k' }
  )
  
  console.log('Poetry Analysis:', poetryResponse.message.content)
  
  // Business Chinese translation
  const businessResponse = await puter.ai.chat(
    '请将以下商务邮件翻译成正式的英文：\n\n尊敬的客户，我们很高兴通知您，您的订单已经准备就绪，将在明天发货。',
    { model: 'moonshot-v1-8k' }
  )
  
  console.log('Business Translation:', businessResponse.message.content)
  
  // Cultural context explanation
  const culturalResponse = await puter.ai.chat(
    '请解释中国传统节日春节的文化意义和现代庆祝方式',
    { model: 'moonshot-v1-8k' }
  )
  
  console.log('Cultural Explanation:', culturalResponse.message.content)
}
```

#### Technical Documentation in Multiple Languages

```javascript
// Generate technical content in different languages
async function technicalMultilingual() {
  const prompt = 'Explain how to implement a REST API with authentication'
  
  // English technical explanation
  const englishResponse = await puter.ai.chat(
    prompt,
    { model: 'moonshot-v1-8k' }
  )
  
  // Chinese technical explanation
  const chineseResponse = await puter.ai.chat(
    '请解释如何实现带有身份验证的REST API',
    { model: 'moonshot-v1-8k' }
  )
  
  // Japanese technical explanation
  const japaneseResponse = await puter.ai.chat(
    '認証機能付きREST APIの実装方法を説明してください',
    { model: 'moonshot-v1-8k' }
  )
  
  console.log('English:', englishResponse.message.content)
  console.log('Chinese:', chineseResponse.message.content)
  console.log('Japanese:', japaneseResponse.message.content)
}
```

#### Academic Research Assistant

```javascript
// Kimi excels at academic and research tasks
async function academicResearch() {
  // Literature review
  const literatureResponse = await puter.ai.chat(
    `Please provide a comprehensive literature review on machine learning applications in healthcare, including:
    1. Current state of research
    2. Key methodologies
    3. Major findings
    4. Future research directions
    5. Limitations and challenges`,
    { 
      model: 'moonshot-v1-32k',
      max_tokens: 3000
    }
  )
  
  console.log('Literature Review:', literatureResponse.message.content)
  
  // Research methodology
  const methodologyResponse = await puter.ai.chat(
    'Design a research methodology for studying the impact of remote work on employee productivity',
    { model: 'moonshot-v1-8k' }
  )
  
  console.log('Research Methodology:', methodologyResponse.message.content)
}
```

#### Multilingual Customer Support

```html
<!DOCTYPE html>
<html>
<head>
  <title>Multilingual Support with Kimi</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .support-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .language-selector { margin-bottom: 20px; }
    .chat-area { border: 1px solid #ddd; height: 400px; overflow-y: auto; padding: 10px; margin-bottom: 10px; }
    .message { margin: 10px 0; padding: 8px; border-radius: 4px; }
    .user { background: #e3f2fd; text-align: right; }
    .assistant { background: #f1f8e9; }
    .input-area { display: flex; gap: 10px; }
    input { flex: 1; padding: 10px; }
    button { padding: 10px 20px; background: #4caf50; color: white; border: none; cursor: pointer; }
  </style>
</head>
<body>
  <div class="support-container">
    <h1>Multilingual Customer Support</h1>
    
    <div class="language-selector">
      <label>Select Language:</label>
      <select id="language-select">
        <option value="en">English</option>
        <option value="zh">中文 (Chinese)</option>
        <option value="ja">日本語 (Japanese)</option>
        <option value="ko">한국어 (Korean)</option>
        <option value="es">Español (Spanish)</option>
      </select>
    </div>
    
    <div id="chat-area" class="chat-area"></div>
    
    <div class="input-area">
      <input type="text" id="user-input" placeholder="Type your question...">
      <button onclick="sendSupportMessage()">Send</button>
    </div>
  </div>

  <script>
    const chatArea = document.getElementById('chat-area')
    const userInput = document.getElementById('user-input')
    const languageSelect = document.getElementById('language-select')

    const welcomeMessages = {
      en: "Hello! How can I help you today?",
      zh: "您好！我今天能为您做些什么？",
      ja: "こんにちは！今日はどのようにお手伝いできますか？",
      ko: "안녕하세요! 오늘 어떻게 도와드릴까요?",
      es: "¡Hola! ¿Cómo puedo ayudarte hoy?"
    }

    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement('div')
      messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`
      messageDiv.textContent = content
      chatArea.appendChild(messageDiv)
      chatArea.scrollTop = chatArea.scrollHeight
    }

    async function sendSupportMessage() {
      const message = userInput.value.trim()
      const language = languageSelect.value
      
      if (!message) return

      addMessage(message, true)
      userInput.value = ''

      try {
        const systemPrompt = `You are a helpful customer support assistant. Respond in ${language === 'en' ? 'English' : language === 'zh' ? 'Chinese' : language === 'ja' ? 'Japanese' : language === 'ko' ? 'Korean' : 'Spanish'}. Be professional, helpful, and provide clear solutions.`

        const response = await puter.ai.chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ], false, { model: 'moonshot-v1-8k' })

        addMessage(response.message.content)
      } catch (error) {
        addMessage('Sorry, I encountered an error. Please try again.')
        console.error('Kimi error:', error)
      }
    }

    // Initialize with welcome message
    languageSelect.addEventListener('change', () => {
      const language = languageSelect.value
      chatArea.innerHTML = ''
      addMessage(welcomeMessages[language])
    })

    // Initial welcome message
    addMessage(welcomeMessages.en)

    // Enter key support
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendSupportMessage()
    })
  </script>
</body>
</html>
```

#### Kimi Model Capabilities

**Core Strengths:**
- **Multilingual Excellence**: Outstanding performance in Chinese and other languages
- **Long Context**: Ability to handle very long conversations and documents
- **Cultural Understanding**: Deep understanding of Chinese culture and context
- **Academic Proficiency**: Strong performance on academic and research topics
- **Technical Proficiency**: Strong performance on technical and academic topics
- **Vision Capabilities**: Image analysis and understanding (VL models)

#### When to Use Kimi Models

**Choose Kimi for:**
- **Chinese Language Tasks**: Superior Chinese language understanding and generation
- **Long Document Analysis**: Processing very long texts and documents
- **Multilingual Applications**: Building applications that serve multiple languages
- **Academic Research**: Research assistance and academic writing
- **Cultural Content**: Content requiring cultural context and understanding
- **Technical Documentation**: Multilingual technical documentation

**Kimi Advantages:**
- **Chinese Excellence**: Best-in-class Chinese language capabilities
- **Long Context**: Handle extremely long documents and conversations
- **Cultural Awareness**: Deep understanding of cultural nuances
- **Academic Focus**: Optimized for research and academic applications
- **Multilingual**: Strong performance across multiple languages

### Free Perplexity AI API Alternative Tutorial

Puter.js provides free access to Perplexity AI models without requiring API keys. Perplexity models excel at research, fact-checking, and providing well-sourced, accurate information. This tutorial shows how to use Perplexity models through Puter.js for building research-focused applications.

#### Available Perplexity Models

Puter.js provides access to Perplexity's research-focused models:

- **llama-3.1-sonar-small-128k-online**: Fast model with real-time web access
- **llama-3.1-sonar-large-128k-online**: More capable model with web search
- **llama-3.1-sonar-huge-128k-online**: Most powerful model for complex research

#### Getting Started with Perplexity

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Research Queries

```javascript
// Perplexity excels at research and fact-finding
async function researchQuery() {
  try {
    const response = await puter.ai.chat(
      'What are the latest developments in quantum computing in 2024?',
      { model: 'llama-3.1-sonar-large-128k-online' }
    )
    
    console.log(response.message.content)
    // Well-researched response with current information
  } catch (error) {
    console.error('Perplexity request failed:', error)
  }
}

researchQuery()
```

#### Fact-Checking and Verification

```javascript
// Use Perplexity for fact-checking claims
async function factCheck() {
  const claims = [
    "The Great Wall of China is visible from space",
    "Goldfish have a 3-second memory",
    "Lightning never strikes the same place twice"
  ]
  
  for (const claim of claims) {
    const response = await puter.ai.chat(
      `Please fact-check this claim and provide sources: "${claim}"`,
      { model: 'llama-3.1-sonar-large-128k-online' }
    )
    
    console.log(`Claim: ${claim}`)
    console.log(`Fact-check: ${response.message.content}`)
    console.log('---')
  }
}

// Verify news and current events
async function verifyNews() {
  const newsHeadline = "Major breakthrough in renewable energy announced"
  
  const response = await puter.ai.chat(
    `Please verify this news headline and provide recent sources: "${newsHeadline}"`,
    { model: 'llama-3.1-sonar-huge-128k-online' }
  )
  
  console.log(response.message.content)
}
```

#### Academic Research Assistant

```javascript
// Comprehensive research on academic topics
async function academicResearch() {
  const researchTopic = "Impact of artificial intelligence on healthcare outcomes"
  
  const response = await puter.ai.chat(
    `Provide a comprehensive research overview on: "${researchTopic}"
    
    Please include:
    1. Current state of research
    2. Key findings and studies
    3. Methodologies used
    4. Future research directions
    5. Reliable sources and citations`,
    { 
      model: 'llama-3.1-sonar-huge-128k-online',
      max_tokens: 3000
    }
  )
  
  console.log(response.message.content)
}

// Literature review generation
async function generateLiteratureReview() {
  const topic = "Machine learning applications in climate change prediction"
  
  const response = await puter.ai.chat(
    `Generate a literature review for: "${topic}"
    
    Include recent papers, methodologies, findings, and gaps in current research.`,
    { model: 'llama-3.1-sonar-large-128k-online' }
  )
  
  console.log(response.message.content)
}
```

#### Market Research and Analysis

```javascript
// Business and market research
async function marketResearch() {
  const industry = "Electric vehicle market"
  
  const response = await puter.ai.chat(
    `Provide a comprehensive market analysis for the ${industry}:
    
    1. Current market size and growth trends
    2. Key players and market share
    3. Recent developments and innovations
    4. Future outlook and predictions
    5. Challenges and opportunities`,
    { model: 'llama-3.1-sonar-large-128k-online' }
  )
  
  console.log(response.message.content)
}

// Competitive analysis
async function competitiveAnalysis() {
  const companies = ["Tesla", "Ford", "General Motors"]
  
  const response = await puter.ai.chat(
    `Compare these companies in the electric vehicle space: ${companies.join(', ')}
    
    Include market position, recent developments, strengths, and challenges.`,
    { model: 'llama-3.1-sonar-large-128k-online' }
  )
  
  console.log(response.message.content)
}
```

#### Real-time Information Queries

```javascript
// Current events and real-time information
async function getCurrentInfo() {
  const queries = [
    "What are the current stock market trends today?",
    "Latest developments in space exploration this month",
    "Recent climate change policy updates globally"
  ]
  
  for (const query of queries) {
    const response = await puter.ai.chat(query, {
      model: 'llama-3.1-sonar-large-128k-online'
    })
    
    console.log(`Query: ${query}`)
    console.log(`Response: ${response.message.content}`)
    console.log('---')
  }
}

// Breaking news analysis
async function analyzeBreakingNews() {
  const response = await puter.ai.chat(
    'What are the most significant news stories happening right now? Provide context and analysis.',
    { model: 'llama-3.1-sonar-huge-128k-online' }
  )
  
  console.log(response.message.content)
}
```

#### Research Dashboard Application

```html
<!DOCTYPE html>
<html>
<head>
  <title>Research Dashboard with Perplexity</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .dashboard { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .search-section { margin-bottom: 30px; }
    .search-input { width: 70%; padding: 12px; font-size: 16px; border: 1px solid #ddd; }
    .search-button { padding: 12px 24px; background: #2196f3; color: white; border: none; cursor: pointer; font-size: 16px; }
    .model-selector { margin: 10px 0; }
    .results-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .result-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
    .result-title { font-weight: bold; margin-bottom: 10px; color: #1976d2; }
    .result-content { line-height: 1.6; white-space: pre-wrap; }
    .loading { text-align: center; color: #666; font-style: italic; }
  </style>
</head>
<body>
  <div class="dashboard">
    <h1>Research Dashboard</h1>
    
    <div class="search-section">
      <input type="text" id="research-query" class="search-input" 
             placeholder="Enter your research question...">
      <button onclick="conductResearch()" class="search-button">Research</button>
      
      <div class="model-selector">
        <label>Model:</label>
        <select id="model-select">
          <option value="llama-3.1-sonar-small-128k-online">Fast Research</option>
          <option value="llama-3.1-sonar-large-128k-online" selected>Comprehensive Research</option>
          <option value="llama-3.1-sonar-huge-128k-online">Deep Research</option>
        </select>
      </div>
    </div>
    
    <div id="results-section" class="results-section"></div>
  </div>

  <script>
    const resultsSection = document.getElementById('results-section')
    const queryInput = document.getElementById('research-query')
    const modelSelect = document.getElementById('model-select')

    async function conductResearch() {
      const query = queryInput.value.trim()
      const model = modelSelect.value
      
      if (!query) {
        alert('Please enter a research question')
        return
      }

      // Clear previous results
      resultsSection.innerHTML = '<div class="loading">Conducting research...</div>'

      try {
        // Main research query
        const mainResponse = await puter.ai.chat(query, { model })

        // Follow-up questions for comprehensive research
        const followUpQueries = [
          `What are the key sources and studies related to: ${query}`,
          `What are the current debates or controversies around: ${query}`,
          `What are the practical implications of: ${query}`
        ]

        const followUpPromises = followUpQueries.map(followUp => 
          puter.ai.chat(followUp, { model })
        )

        const followUpResponses = await Promise.all(followUpPromises)

        // Display results
        resultsSection.innerHTML = `
          <div class="result-card">
            <div class="result-title">Main Research Results</div>
            <div class="result-content">${mainResponse.message.content}</div>
          </div>
          
          <div class="result-card">
            <div class="result-title">Key Sources & Studies</div>
            <div class="result-content">${followUpResponses[0].message.content}</div>
          </div>
          
          <div class="result-card">
            <div class="result-title">Current Debates</div>
            <div class="result-content">${followUpResponses[1].message.content}</div>
          </div>
          
          <div class="result-card">
            <div class="result-title">Practical Implications</div>
            <div class="result-content">${followUpResponses[2].message.content}</div>
          </div>
        `
      } catch (error) {
        resultsSection.innerHTML = '<div class="result-card">Error conducting research. Please try again.</div>'
        console.error('Research error:', error)
      }
    }

    // Enter key support
    queryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') conductResearch()
    })
  </script>
</body>
</html>
```

#### Perplexity Model Capabilities

**Core Strengths:**
- **Real-time Information**: Access to current and up-to-date information
- **Factual Accuracy**: Focus on providing well-researched, factual responses
- **Citation Support**: Ability to reference sources and provide citations
- **Complex Analysis**: Deep analysis of multifaceted topics
- **Research Excellence**: Optimized for research and fact-finding tasks
- **Professional Insights**: Business and academic-level research capabilities

#### When to Use Perplexity Models

**Choose Perplexity for:**
- **Research Projects**: Academic and professional research tasks
- **Fact-Checking**: Verifying claims and information accuracy
- **Current Events**: Getting up-to-date information on recent developments
- **Market Analysis**: Business intelligence and market research
- **Academic Writing**: Literature reviews and research papers
- **Journalism**: Fact-checking and investigative research

**Perplexity Advantages:**
- **Real-time Access**: Current information and recent developments
- **Source Quality**: Focus on reliable, authoritative sources
- **Research Focus**: Optimized specifically for research tasks
- **Fact Accuracy**: Strong emphasis on factual correctness
- **Citation Support**: Provides sources and references for claims

### Free OpenRouter API Alternative Tutorial

Puter.js provides free access to hundreds of AI models through OpenRouter without requiring API keys. OpenRouter aggregates models from multiple providers including OpenAI, Anthropic, Google, Meta, and many others. This tutorial shows how to access this vast collection of AI models through Puter.js.

#### Available OpenRouter Models

Puter.js provides access to hundreds of models through OpenRouter, including:

**OpenAI Models:**
- **GPT-4 Turbo**: Latest GPT-4 with improved performance
- **GPT-4**: Standard GPT-4 for complex reasoning tasks
- **GPT-3.5 Turbo**: Fast and efficient for most applications

**Anthropic Models:**
- **Claude 3.5 Sonnet**: Latest Claude with enhanced capabilities
- **Claude 3 Opus**: Most capable Claude model
- **Claude 3 Haiku**: Fast and efficient Claude variant

**Google Models:**
- **Gemini Pro**: Google's flagship model
- **Gemini 2.0 Flash**: Balanced performance and speed
- **Gemini 1.5 Flash**: Fast responses, good for real-time applications
- **Gemma Models**: Lightweight options for specific use cases

**Meta Models:**
- **Llama 3.1 405B**: Largest open-source model
- **Llama 3.1 70B**: Balanced performance and efficiency
- **Llama 3.1 8B**: Fast and lightweight

**Specialized Models:**
- **Text Generation**: GPT, Claude, Llama, Mistral, Qwen models
- **Code Generation**: Specialized coding models from various providers
- **Image Generation**: DALL-E, Midjourney, Stable Diffusion variants
- **Reasoning**: Advanced reasoning models like o1, DeepSeek-R1
- **Vision**: Multimodal models for image understanding
- **Specialized**: Domain-specific models for particular use cases

#### When to Use OpenRouter Models

**Choose OpenRouter when you need:**
- **Model Variety**: Access to hundreds of different AI models
- **Provider Comparison**: Testing different models for your use case
- **Specialized Tasks**: Access to domain-specific models
- **Cost Optimization**: Finding the most cost-effective model for your needs
- **Latest Models**: Access to cutting-edge models from multiple providers

#### Getting Started with OpenRouter

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Model Comparison

```javascript
// Compare responses from different model providers
async function compareModels() {
  const prompt = "Explain quantum computing in simple terms"
  
  const models = [
    'openai/gpt-4-turbo',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-pro',
    'meta-llama/llama-3.1-70b-instruct'
  ]
  
  console.log('Comparing models for prompt:', prompt)
  
  for (const model of models) {
    try {
      const response = await puter.ai.chat(prompt, { model })
      
      console.log(`\n${model}:`)
      console.log(response.message.content)
      console.log('---')
    } catch (error) {
      console.error(`Error with ${model}:`, error)
    }
  }
}

compareModels()
```

#### Specialized Model Usage

```javascript
// Use specialized models for specific tasks
async function useSpecializedModels() {
  // Code generation with specialized model
  const codeResponse = await puter.ai.chat(
    'Write a Python function to calculate fibonacci numbers with memoization',
    { model: 'deepseek/deepseek-coder-33b-instruct' }
  )
  
  console.log('Code Generation:', codeResponse.message.content)
  
  // Mathematical reasoning with specialized model
  const mathResponse = await puter.ai.chat(
    'Solve this calculus problem: Find the derivative of x^3 * sin(x)',
    { model: 'openai/gpt-4-turbo' }
  )
  
  console.log('Math Solution:', mathResponse.message.content)
  
  // Creative writing with specialized model
  const creativeResponse = await puter.ai.chat(
    'Write a short story about a robot learning to paint',
    { model: 'anthropic/claude-3-opus' }
  )
  
  console.log('Creative Writing:', creativeResponse.message.content)
}
```

#### Model Performance Testing

```javascript
// Test different models for speed and quality
async function testModelPerformance() {
  const testPrompt = "Summarize the benefits of renewable energy"
  
  const models = [
    { name: 'GPT-3.5 Turbo', id: 'openai/gpt-3.5-turbo' },
    { name: 'Claude Haiku', id: 'anthropic/claude-3-haiku' },
    { name: 'Gemini Flash', id: 'google/gemini-1.5-flash' },
    { name: 'Llama 3.1 8B', id: 'meta-llama/llama-3.1-8b-instruct' }
  ]
  
  for (const model of models) {
    const startTime = Date.now()
    
    try {
      const response = await puter.ai.chat(testPrompt, { model: model.id })
      const endTime = Date.now()
      const duration = endTime - startTime
      
      console.log(`${model.name}:`)
      console.log(`Response time: ${duration}ms`)
      console.log(`Response: ${response.message.content.substring(0, 200)}...`)
      console.log('---')
    } catch (error) {
      console.error(`Error testing ${model.name}:`, error)
    }
  }
}
```

#### Advanced Model Selection

```javascript
// Intelligent model selection based on task type
function selectOptimalModel(taskType) {
  const modelRecommendations = {
    'code': 'deepseek/deepseek-coder-33b-instruct',
    'creative': 'anthropic/claude-3-opus',
    'analysis': 'openai/gpt-4-turbo',
    'fast': 'openai/gpt-3.5-turbo',
    'reasoning': 'openai/o1-preview',
    'vision': 'openai/gpt-4-vision-preview',
    'math': 'openai/gpt-4-turbo',
    'conversation': 'anthropic/claude-3.5-sonnet'
  }
  
  return modelRecommendations[taskType] || 'openai/gpt-3.5-turbo'
}

async function smartModelUsage() {
  const tasks = [
    { type: 'code', prompt: 'Create a React component for a todo list' },
    { type: 'creative', prompt: 'Write a poem about artificial intelligence' },
    { type: 'analysis', prompt: 'Analyze the pros and cons of remote work' },
    { type: 'math', prompt: 'Explain the concept of derivatives in calculus' }
  ]
  
  for (const task of tasks) {
    const optimalModel = selectOptimalModel(task.type)
    
    console.log(`Task: ${task.type}`)
    console.log(`Selected model: ${optimalModel}`)
    
    const response = await puter.ai.chat(task.prompt, { model: optimalModel })
    console.log(`Response: ${response.message.content.substring(0, 200)}...`)
    console.log('---')
  }
}
```

#### Model Explorer Dashboard

```html
<!DOCTYPE html>
<html>
<head>
  <title>OpenRouter Model Explorer</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .explorer { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .controls { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .control-group { padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
    .model-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .model-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9; }
    .model-name { font-weight: bold; color: #1976d2; margin-bottom: 10px; }
    .model-response { background: white; padding: 15px; border-radius: 4px; margin-top: 10px; line-height: 1.6; }
    .loading { opacity: 0.6; }
    input, select, textarea { width: 100%; padding: 8px; margin: 5px 0; }
    button { padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="explorer">
    <h1>OpenRouter Model Explorer</h1>
    
    <div class="controls">
      <div class="control-group">
        <h3>Prompt</h3>
        <textarea id="test-prompt" rows="4" placeholder="Enter your prompt here...">Explain the concept of machine learning in simple terms</textarea>
        <button onclick="testAllModels()">Test All Models</button>
      </div>
      
      <div class="control-group">
        <h3>Model Category</h3>
        <select id="category-filter">
          <option value="all">All Models</option>
          <option value="openai">OpenAI Models</option>
          <option value="anthropic">Anthropic Models</option>
          <option value="google">Google Models</option>
          <option value="meta">Meta Models</option>
          <option value="code">Code Specialists</option>
        </select>
        <button onclick="filterModels()">Filter</button>
      </div>
      
      <div class="control-group">
        <h3>Settings</h3>
        <label>Max Tokens: <input type="number" id="max-tokens" value="500" min="100" max="2000"></label>
        <label>Temperature: <input type="range" id="temperature" min="0" max="2" step="0.1" value="0.7"></label>
        <span id="temp-value">0.7</span>
      </div>
    </div>
    
    <div id="model-results" class="model-grid"></div>
  </div>

  <script>
    const modelCategories = {
      all: [
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-pro',
        'google/gemini-1.5-flash',
        'meta-llama/llama-3.1-70b-instruct',
        'meta-llama/llama-3.1-8b-instruct'
      ],
      openai: [
        'openai/gpt-4-turbo',
        'openai/gpt-4',
        'openai/gpt-3.5-turbo'
      ],
      anthropic: [
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-haiku'
      ],
      google: [
        'google/gemini-pro',
        'google/gemini-1.5-flash',
        'google/gemini-2.0-flash-exp'
      ],
      meta: [
        'meta-llama/llama-3.1-405b-instruct',
        'meta-llama/llama-3.1-70b-instruct',
        'meta-llama/llama-3.1-8b-instruct'
      ],
      code: [
        'deepseek/deepseek-coder-33b-instruct',
        'codellama/codellama-34b-instruct',
        'openai/gpt-4-turbo'
      ]
    }

    const temperatureSlider = document.getElementById('temperature')
    const tempValue = document.getElementById('temp-value')
    
    temperatureSlider.addEventListener('input', () => {
      tempValue.textContent = temperatureSlider.value
    })

    async function testAllModels() {
      const prompt = document.getElementById('test-prompt').value
      const category = document.getElementById('category-filter').value
      const maxTokens = parseInt(document.getElementById('max-tokens').value)
      const temperature = parseFloat(document.getElementById('temperature').value)
      
      if (!prompt.trim()) {
        alert('Please enter a prompt')
        return
      }

      const models = modelCategories[category] || modelCategories.all
      const resultsContainer = document.getElementById('model-results')
      
      // Clear previous results and show loading
      resultsContainer.innerHTML = models.map(model => `
        <div class="model-card loading">
          <div class="model-name">${model}</div>
          <div class="model-response">Testing...</div>
        </div>
      `).join('')

      // Test each model
      for (let i = 0; i < models.length; i++) {
        const model = models[i]
        const startTime = Date.now()
        
        try {
          const response = await puter.ai.chat(prompt, {
            model,
            max_tokens: maxTokens,
            temperature
          })
          
          const endTime = Date.now()
          const duration = endTime - startTime
          
          // Update the specific model card
          const modelCards = document.querySelectorAll('.model-card')
          const modelCard = modelCards[i]
          
          modelCard.classList.remove('loading')
          modelCard.innerHTML = `
            <div class="model-name">${model}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
              Response time: ${duration}ms
            </div>
            <div class="model-response">${response.message.content}</div>
          `
        } catch (error) {
          const modelCards = document.querySelectorAll('.model-card')
          const modelCard = modelCards[i]
          
          modelCard.classList.remove('loading')
          modelCard.innerHTML = `
            <div class="model-name">${model}</div>
            <div class="model-response" style="color: red;">
              Error: ${error.message}
            </div>
          `
        }
      }
    }

    function filterModels() {
      // This function is called when filter changes
      // The actual filtering happens in testAllModels()
      console.log('Filter changed to:', document.getElementById('category-filter').value)
    }
  </script>
</body>
</html>
```

#### OpenRouter Best Practices

**Model Selection Guidelines:**
- **Use GPT-4 Turbo** for complex reasoning and analysis tasks
- **Use Claude 3.5 Sonnet** for creative writing and nuanced conversations
- **Use Gemini Flash** for fast responses and real-time applications
- **Use Llama models** for open-source alternatives and cost efficiency
- **Use specialized models** for domain-specific tasks (coding, math, etc.)

**Performance Optimization:**
- **Test multiple models** to find the best fit for your specific use case
- **Use streaming** for longer responses to improve user experience
- **Implement fallbacks** in case a specific model is unavailable
- **Monitor response times** and adjust model selection accordingly
- **Cache responses** when appropriate to reduce API calls

### Free OpenAI API Alternative Tutorial

Puter.js provides completely free access to OpenAI API capabilities without needing an API key. This tutorial shows how to use Puter.js as a powerful, free alternative to traditional OpenAI API access, allowing you to provide users with advanced AI capabilities at no cost.

#### Getting Started

You can use Puter.js without any API keys or sign-ups. Simply include the script tag:

```html
<script src="https://js.puter.com/v2/"></script>
```

That's it! You're now ready to access GPT-5, GPT-4o, DALL-E, and other AI models for free.

#### Example 1: Basic Text Generation with GPT-5 Nano

```javascript
// Simple text generation
puter.ai.chat("What are the benefits of exercise?", { model: "gpt-5-nano" })
  .then(response => {
    console.log(response.message.content)
  })

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("What are the benefits of exercise?", { model: "gpt-5-nano" })
      .then(response => {
        puter.print(response.message.content)
      })
  </script>
</body>
</html>
*/
```

#### Example 2: Image Generation with GPT Image

```javascript
// Generate images using GPT Image
puter.ai.txt2img("A futuristic cityscape at night", { model: "gpt-image-1" })
  .then(imageElement => {
    document.body.appendChild(imageElement)
  })

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.txt2img("A futuristic cityscape at night", { model: "gpt-image-1" })
      .then(imageElement => {
        document.body.appendChild(imageElement)
      })
  </script>
</body>
</html>
*/
```

#### Example 3: Image Analysis

```javascript
// Analyze images with vision capabilities
puter.ai.chat(
  "What do you see in this image?", 
  "https://assets.puter.site/doge.jpeg",
  false,
  { model: "gpt-5-nano" }
).then(response => {
  console.log(response.message.content)
})
```

#### Example 4: Multiple OpenAI Models

```javascript
// Access different OpenAI models
const models = ['gpt-5', 'gpt-5-nano', 'gpt-5-mini', 'gpt-5-chat-latest']

models.forEach(async (model) => {
  const response = await puter.ai.chat(
    "Write a short poem about coding",
    { model: model }
  )
  console.log(`${model}: ${response.message.content}`)
})
```

#### Example 5: Streaming Responses

```javascript
// Stream responses for real-time output
async function streamResponse() {
  const response = await puter.ai.chat(
    "Explain the theory of relativity in detail",
    { stream: true, model: "gpt-5-nano" }
  )
  
  for await (const part of response) {
    console.log(part?.text)
  }
}

streamResponse()
```

#### Example 6: Control Output with Temperature and Max Tokens

```javascript
// Low temperature for focused output
const focused = await puter.ai.chat(
  'Tell me about planet Mars',
  {
    temperature: 0.2,
    max_tokens: 100,
    model: "gpt-5-nano"
  }
)

// High temperature for creative output
const creative = await puter.ai.chat(
  'Tell me about planet Mars',
  {
    temperature: 0.8,
    max_tokens: 100,
    model: "gpt-5-nano"
  }
)
```

#### Example 7: Function/Tool Calling

```javascript
// Define tools for the AI to use
const tools = [{
  type: "function",
  function: {
    name: "calculate",
    description: "Perform basic math operations",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"]
        },
        a: { type: "number" },
        b: { type: "number" }
      },
      required: ["operation", "a", "b"]
    }
  }
}]

// Ask AI to use the tool
puter.ai.chat("What is 15 multiplied by 7?", { tools }).then(response => {
  if (response.message.tool_calls) {
    const call = response.message.tool_calls[0]
    const args = JSON.parse(call.function.arguments)
    
    // Execute the function
    let result
    if (args.operation === "multiply") {
      result = args.a * args.b
    }
    
    console.log(`AI requested: ${args.a} × ${args.b} = ${result}`)
  }
})
```

#### Supported Models

**Text Generation Models:**
- `gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5-chat-latest`
- `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`, `gpt-4.5-preview`
- `gpt-4o`, `gpt-4o-mini`
- `o1`, `o1-mini`, `o1-pro`
- `o3`, `o3-mini`
- `o4-mini`

**Image Generation Models:**
- `gpt-image-1`
- `dall-e-3`, `dall-e-2`

#### User Pays Model

Puter.js pioneered the "User Pays" model, which allows developers to incorporate AI capabilities into their applications while each user covers their own usage costs. This enables developers to offer advanced AI capabilities without any cost to themselves, API keys, or server-side setup.

#### Benefits

- **No API Keys Required**: Start using immediately without registration
- **No Usage Limits**: Users pay for their own usage
- **No Backend Setup**: Everything runs in the frontend
- **Latest Models**: Access to GPT-5, o1, o3, and other cutting-edge models
- **Multiple Capabilities**: Text generation, image creation, image analysis, and more
- **Free for Developers**: Zero cost to integrate AI into your applications











### Free Liquid AI API Alternative Tutorial

Puter.js provides free access to Liquid AI's Large Foundation Models (LFMs) without requiring API keys. Liquid AI models are built on innovative Liquid Neural Networks architecture, offering unique capabilities for dynamic reasoning and adaptive processing. This tutorial shows how to use Liquid AI models through Puter.js.

#### Available Liquid AI Models

Puter.js provides access to Liquid AI's foundation models:

- **liquid/lfm-40b**: Liquid AI's 40B parameter foundation model
- **liquid/lfm-40b-moe**: Mixture of Experts variant for specialized tasks

#### Getting Started with Liquid AI

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Liquid AI Usage

```javascript
// Simple conversation with Liquid AI
async function chatWithLiquid() {
  try {
    const response = await puter.ai.chat(
      'Explain the concept of liquid neural networks and their advantages',
      { model: 'liquid/lfm-40b' }
    )
    
    console.log(response.message.content)
    // Liquid AI's unique perspective on neural architectures
  } catch (error) {
    console.error('Liquid AI request failed:', error)
  }
}

chatWithLiquid()
```

#### Dynamic Reasoning with Liquid AI

```javascript
// Liquid AI excels at adaptive reasoning
async function dynamicReasoning() {
  const complexProblem = `
    A company has three departments: Sales, Marketing, and Engineering.
    - Sales team has 12 people, each earning $60,000 annually
    - Marketing team has 8 people, each earning $70,000 annually  
    - Engineering team has 15 people, each earning $90,000 annually
    
    The company wants to give a 10% raise to the department with the highest total payroll,
    a 5% raise to the middle department, and a 3% raise to the lowest.
    
    Calculate the new total payroll for each department and the overall company payroll increase.
  `
  
  const response = await puter.ai.chat(complexProblem, {
    model: 'liquid/lfm-40b',
    temperature: 0.1  // Lower temperature for precise calculations
  })
  
  console.log('Liquid AI Dynamic Reasoning:')
  console.log(response.message.content)
}

// Adaptive problem solving
async function adaptiveProblemSolving() {
  const scenarios = [
    'How would you optimize a supply chain during a global pandemic?',
    'Design a sustainable energy system for a remote island community',
    'Create a strategy for reducing urban traffic congestion'
  ]
  
  for (const scenario of scenarios) {
    const response = await puter.ai.chat(scenario, {
      model: 'liquid/lfm-40b-moe',  // Use MoE for specialized reasoning
      max_tokens: 1000
    })
    
    console.log(`\nScenario: ${scenario}`)
    console.log('Liquid AI Solution:')
    console.log(response.message.content)
    console.log('---')
  }
}
```

#### Technical Analysis with Liquid AI

```javascript
// Liquid AI for technical and scientific analysis
async function technicalAnalysis() {
  // Code architecture analysis
  const codeAnalysis = await puter.ai.chat(`
    Analyze this Python code and suggest improvements:
    
    def process_data(data):
        result = []
        for item in data:
            if item > 0:
                result.append(item * 2)
            else:
                result.append(0)
        return result
    
    def main():
        numbers = [1, -2, 3, -4, 5]
        processed = process_data(numbers)
        print(processed)
    
    main()
  `, { model: 'liquid/lfm-40b' })
  
  console.log('Code Analysis:', codeAnalysis.message.content)
  
  // System design analysis
  const systemDesign = await puter.ai.chat(
    'Design a microservices architecture for a real-time chat application with 1M+ users',
    { model: 'liquid/lfm-40b-moe' }
  )
  
  console.log('System Design:', systemDesign.message.content)
  
  // Algorithm optimization
  const algorithmOptimization = await puter.ai.chat(
    'Optimize this sorting algorithm for large datasets and explain the time complexity improvements',
    { model: 'liquid/lfm-40b' }
  )
  
  console.log('Algorithm Optimization:', algorithmOptimization.message.content)
}
```

#### Liquid AI for Research and Analysis

```javascript
// Research assistance with Liquid AI
async function researchAssistance() {
  // Literature analysis
  const literatureAnalysis = await puter.ai.chat(`
    Analyze the current state of research in quantum machine learning:
    1. Key breakthroughs in the last 2 years
    2. Main challenges and limitations
    3. Promising future directions
    4. Potential applications in industry
  `, { 
    model: 'liquid/lfm-40b',
    max_tokens: 2000
  })
  
  console.log('Literature Analysis:', literatureAnalysis.message.content)
  
  // Data interpretation
  const dataInterpretation = await puter.ai.chat(`
    Given this dataset summary:
    - Customer satisfaction scores: Mean 7.2/10, Std Dev 1.8
    - Response rate: 65% (1,300 out of 2,000 customers)
    - Top complaints: Delivery time (35%), Product quality (28%), Customer service (22%)
    - Repeat purchase rate: 68%
    
    Provide insights and recommendations for improvement.
  `, { model: 'liquid/lfm-40b-moe' })
  
  console.log('Data Interpretation:', dataInterpretation.message.content)
}
```

#### Interactive Liquid AI Assistant

```html
<!DOCTYPE html>
<html>
<head>
  <title>Liquid AI Assistant</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .assistant { max-width: 900px; margin: 0 auto; padding: 20px; }
    .model-selector { margin-bottom: 20px; padding: 15px; background: #f0f8ff; border-radius: 8px; }
    .chat-container { border: 1px solid #ddd; height: 500px; overflow-y: auto; padding: 15px; margin-bottom: 15px; background: white; border-radius: 8px; }
    .message { margin: 15px 0; padding: 12px; border-radius: 8px; }
    .user { background: #e3f2fd; text-align: right; }
    .liquid { background: #f1f8e9; border-left: 4px solid #4caf50; }
    .input-area { display: flex; gap: 10px; }
    .message-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
    .send-btn { padding: 12px 24px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .send-btn:disabled { background: #ccc; cursor: not-allowed; }
    .thinking { font-style: italic; color: #666; }
    .model-info { font-size: 12px; color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="assistant">
    <h1>Liquid AI Assistant</h1>
    <p>Experience the power of Liquid Neural Networks for dynamic reasoning and adaptive problem solving</p>
    
    <div class="model-selector">
      <label><strong>Select Liquid AI Model:</strong></label>
      <select id="model-select" style="margin-left: 10px; padding: 5px;">
        <option value="liquid/lfm-40b">LFM-40B (General Purpose)</option>
        <option value="liquid/lfm-40b-moe">LFM-40B-MoE (Specialized Tasks)</option>
      </select>
      <div class="model-info" id="model-info">
        LFM-40B: Liquid AI's foundation model with dynamic reasoning capabilities
      </div>
    </div>
    
    <div id="chat-container" class="chat-container">
      <div class="message liquid">
        <strong>Liquid AI:</strong> Hello! I'm powered by Liquid Neural Networks, which gives me unique capabilities for adaptive reasoning and dynamic problem solving. How can I help you today?
      </div>
    </div>
    
    <div class="input-area">
      <input type="text" id="message-input" class="message-input" 
             placeholder="Ask me about complex problems, technical analysis, or research questions...">
      <button onclick="sendMessage()" id="send-button" class="send-btn">Send</button>
    </div>
  </div>

  <script>
    const chatContainer = document.getElementById('chat-container')
    const messageInput = document.getElementById('message-input')
    const sendButton = document.getElementById('send-button')
    const modelSelect = document.getElementById('model-select')
    const modelInfo = document.getElementById('model-info')

    const modelDescriptions = {
      'liquid/lfm-40b': 'LFM-40B: Liquid AI\'s foundation model with dynamic reasoning capabilities',
      'liquid/lfm-40b-moe': 'LFM-40B-MoE: Mixture of Experts model for specialized and complex tasks'
    }

    modelSelect.addEventListener('change', () => {
      modelInfo.textContent = modelDescriptions[modelSelect.value]
    })

    function addMessage(content, isUser = false, model = null) {
      const messageDiv = document.createElement('div')
      messageDiv.className = `message ${isUser ? 'user' : 'liquid'}`
      
      if (isUser) {
        messageDiv.innerHTML = `<strong>You:</strong> ${content}`
      } else {
        messageDiv.innerHTML = `<strong>Liquid AI${model ? ` (${model})` : ''}:</strong> ${content}`
      }
      
      chatContainer.appendChild(messageDiv)
      chatContainer.scrollTop = chatContainer.scrollHeight
    }

    async function sendMessage() {
      const message = messageInput.value.trim()
      const selectedModel = modelSelect.value
      
      if (!message) return

      addMessage(message, true)
      messageInput.value = ''
      sendButton.disabled = true
      sendButton.textContent = 'Thinking...'

      // Add thinking indicator
      const thinkingDiv = document.createElement('div')
      thinkingDiv.className = 'message liquid thinking'
      thinkingDiv.innerHTML = '<strong>Liquid AI:</strong> Processing with liquid neural networks...'
      chatContainer.appendChild(thinkingDiv)
      chatContainer.scrollTop = chatContainer.scrollHeight

      try {
        const response = await puter.ai.chat(message, {
          model: selectedModel,
          temperature: 0.7,
          max_tokens: 1500
        })

        // Remove thinking indicator
        chatContainer.removeChild(thinkingDiv)
        
        // Add response
        addMessage(response.message.content, false, selectedModel.split('/')[1])

      } catch (error) {
        chatContainer.removeChild(thinkingDiv)
        addMessage('I encountered an error processing your request. Please try again.', false)
        console.error('Liquid AI error:', error)
      } finally {
        sendButton.disabled = false
        sendButton.textContent = 'Send'
      }
    }

    // Enter key support
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage()
      }
    })

    // Example prompts
    const examplePrompts = [
      'Analyze the trade-offs between microservices and monolithic architecture',
      'How would you design a carbon-neutral transportation system for a city?',
      'Explain quantum entanglement and its applications in computing',
      'Optimize this algorithm for better performance and scalability'
    ]

    // Add example prompts as clickable suggestions
    const examplesContainer = document.createElement('div')
    examplesContainer.style.marginTop = '15px'
    examplesContainer.innerHTML = '<p><strong>Try these examples:</strong></p>'

    examplePrompts.forEach(prompt => {
      const btn = document.createElement('button')
      btn.textContent = prompt
      btn.style.margin = '5px'
      btn.style.padding = '8px 12px'
      btn.style.background = '#e8f5e8'
      btn.style.border = '1px solid #4caf50'
      btn.style.borderRadius = '4px'
      btn.style.cursor = 'pointer'
      btn.style.fontSize = '12px'
      btn.onclick = () => {
        messageInput.value = prompt
        messageInput.focus()
      }
      examplesContainer.appendChild(btn)
    })

    document.querySelector('.assistant').appendChild(examplesContainer)
  </script>
</body>
</html>
```

#### Liquid AI Model Capabilities

**Core Capabilities:**
- **Dynamic Reasoning**: Adaptive problem-solving that adjusts to context
- **Technical Proficiency**: Strong performance on programming and technical tasks
- **Complex Analysis**: Deep analysis of multifaceted problems and systems
- **Reasoning**: Good logical thinking and problem-solving abilities
- **Function Calling**: Support for external tool integration
- **Conversational AI**: Natural dialogue and multi-turn conversations
- **Context Awareness**: Maintains context across long conversations

#### When to Use Liquid AI Models

**Choose Liquid AI for:**
- **Complex Problem Solving**: Multi-step reasoning and analysis
- **Technical Architecture**: System design and optimization
- **Research Analysis**: Scientific and academic research assistance
- **Algorithm Development**: Code optimization and algorithm design
- **Dynamic Scenarios**: Problems requiring adaptive reasoning
- **Specialized Tasks**: Use MoE variant for domain-specific expertise

**Liquid AI Advantages:**
- **Liquid Neural Networks**: Unique architecture for dynamic processing
- **Adaptive Reasoning**: Adjusts reasoning approach based on problem type
- **Technical Excellence**: Strong performance on technical and scientific tasks
- **Innovation**: Cutting-edge neural network architecture
- **Specialized Variants**: MoE model for expert-level specialized tasks







#### Example 1: Basic Text Generation with DeepSeek Chat (DeepSeek V3.1)

```javascript
// Simple text generation with DeepSeek Chat
puter.ai.chat("Explain quantum entanglement in simple terms", {
  model: 'deepseek-chat'
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain quantum entanglement in simple terms", {
      model: 'deepseek-chat'
    }).then(response => {
      document.write(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Complex Reasoning with DeepSeek Reasoner (DeepSeek R1)

```javascript
// Advanced reasoning with DeepSeek Reasoner
puter.ai.chat(
  "What would be the environmental impact of replacing all cars with electric vehicles? Consider both positive and negative effects.",
  { model: 'deepseek-reasoner' }
).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat(
      "What would be the environmental impact of replacing all cars with electric vehicles? Consider both positive and negative effects.",
      { model: 'deepseek-reasoner' }
    ).then(response => {
      document.write(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 3: Streaming Responses with DeepSeek

```javascript
// Stream DeepSeek responses for real-time output
async function streamDeepSeekResponse() {
  // DeepSeek Chat with streaming
  console.log('DeepSeek Chat Response:')
  const chatResponse = await puter.ai.chat(
    "Explain the significance of dark matter in the universe",
    {
      model: 'deepseek-chat',
      stream: true
    }
  )
  
  for await (const part of chatResponse) {
    if (part?.text) {
      console.log(part.text)
    }
  }
  
  // DeepSeek Reasoner with streaming
  console.log('DeepSeek Reasoner Response:')
  const reasonerResponse = await puter.ai.chat(
    "Explain the significance of dark matter in the universe",
    {
      model: 'deepseek-reasoner',
      stream: true
    }
  )
  
  for await (const part of reasonerResponse) {
    if (part?.text) {
      console.log(part.text)
    }
  }
}

streamDeepSeekResponse()

// Complete HTML example
/*
<html>
<body>
  <div id="output"></div>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    async function streamResponse() {
      const outputDiv = document.getElementById('output')
      
      // DeepSeek Chat with streaming
      outputDiv.innerHTML += '<h2>DeepSeek Chat Response:</h2>'
      const chatResponse = await puter.ai.chat(
        "Explain the significance of dark matter in the universe",
        {
          model: 'deepseek-chat',
          stream: true
        }
      )
      
      for await (const part of chatResponse) {
        if (part?.text) {
          outputDiv.innerHTML += part.text
        }
      }
      
      // DeepSeek Reasoner with streaming
      outputDiv.innerHTML += '<h2>DeepSeek Reasoner Response:</h2>'
      const reasonerResponse = await puter.ai.chat(
        "Explain the significance of dark matter in the universe",
        {
          model: 'deepseek-reasoner',
          stream: true
        }
      )
      
      for await (const part of reasonerResponse) {
        if (part?.text) {
          outputDiv.innerHTML += part.text
        }
      }
    }
    
    streamResponse()
  </script>
</body>
</html>
*/
```

#### Example 4: Comparing DeepSeek Models

```javascript
// Compare responses from DeepSeek Chat vs DeepSeek Reasoner
async function compareDeepSeekModels() {
  const puzzle = 'Solve this puzzle: If you have 9 coins and one is counterfeit (lighter), how can you identify it with just 2 weighings on a balance scale?'
  
  // DeepSeek Chat solution
  const chatResponse = await puter.ai.chat(puzzle, {
    model: 'deepseek-chat'
  })
  console.log('DeepSeek Chat Solution:', chatResponse.message.content)
  
  // DeepSeek Reasoner solution
  const reasonerResponse = await puter.ai.chat(puzzle, {
    model: 'deepseek-reasoner'
  })
  console.log('DeepSeek Reasoner Solution:', reasonerResponse.message.content)
}

compareDeepSeekModels()

// Complete HTML example with streaming comparison
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    (async () => {
      const puzzle = 'Solve this puzzle: If you have 9 coins and one is counterfeit (lighter), how can you identify it with just 2 weighings on a balance scale?'
      
      // DeepSeek Chat
      const chatResp = await puter.ai.chat(puzzle, {
        model: 'deepseek-chat', 
        stream: true
      })
      document.write('<h2>DeepSeek Chat Solution:</h2>')
      for await (const part of chatResp) {
        if (part?.text) {
          document.write(part.text.replaceAll('\n', '<br>'))
        }
      }
      
      // DeepSeek Reasoner
      const reasonerResp = await puter.ai.chat(puzzle, {
        model: 'deepseek-reasoner', 
        stream: true
      })
      document.write('<h2>DeepSeek Reasoner Solution:</h2>')
      for await (const part of reasonerResp) {
        if (part?.text) {
          document.write(part.text.replaceAll('\n', '<br>'))
        }
      }
    })()
  </script>
</body>
</html>
*/
```

#### Available DeepSeek Models

**DeepSeek Models via Puter.js:**
- `deepseek-chat` - DeepSeek V3.1 for general text generation and conversation
- `deepseek-reasoner` - DeepSeek R1 for complex reasoning and step-by-step analysis

#### DeepSeek Model Capabilities

**DeepSeek Chat (DeepSeek V3.1):**
- **General Text Generation**: High-quality text generation for various tasks
- **Conversational AI**: Natural dialogue and chat capabilities
- **Code Generation**: Writing and explaining code across multiple languages
- **Creative Writing**: Stories, articles, and creative content
- **Fast Response Times**: Optimized for quick inference
- **Multilingual Support**: Strong performance across multiple languages

**DeepSeek Reasoner (DeepSeek R1):**
- **Complex Reasoning**: Advanced logical thinking and problem-solving
- **Step-by-Step Analysis**: Detailed breakdown of complex problems
- **Mathematical Problem Solving**: Strong mathematical and analytical capabilities
- **Scientific Reasoning**: Deep understanding of scientific concepts and methods
- **Puzzle Solving**: Excellent at logic puzzles and brain teasers
- **Chain of Thought**: Explicit reasoning process with detailed explanations

#### When to Use DeepSeek Models

**Use DeepSeek Chat For:**
- General text generation and conversation
- Quick responses and real-time chat applications
- Code generation and programming assistance
- Creative writing and content creation
- Multilingual content generation
- Educational explanations and tutoring

**Use DeepSeek Reasoner For:**
- Complex problem-solving and analysis
- Mathematical and scientific reasoning
- Logic puzzles and brain teasers
- Step-by-step explanations of complex concepts
- Research and academic analysis
- Situations requiring detailed reasoning chains

#### Best Practices

- **Use streaming** for longer responses to provide better user experience
- **Consider model strengths** when choosing between Chat and Reasoner
- **Handle errors gracefully** and provide feedback during processing
- **Implement retry logic** for failed requests
- **Use appropriate error handling** for network issues or API failures

#### Model Comparison Summary

| Feature | DeepSeek Chat | DeepSeek Reasoner |
|---------|---------------|-------------------|
| **Speed** | Fast | Moderate |
| **Reasoning** | Good | Excellent |
| **Creativity** | High | Moderate |
| **Problem Solving** | Good | Excellent |
| **Code Generation** | Excellent | Good |
| **Mathematical Tasks** | Good | Excellent |
| **Best For** | General use, chat, code | Complex reasoning, analysis |







#### Example 1: Basic Text Generation with Llama 4 Maverick

```javascript
// Simple text generation with Llama 4 Maverick
puter.ai.chat("Explain how machine learning works to a beginner", {
  model: 'meta-llama/llama-4-maverick'
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain how machine learning works to a beginner", {
      model: 'meta-llama/llama-4-maverick'
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Streaming Responses with Llama

```javascript
// Stream Llama responses for real-time output
async function streamLlamaResponse() {
  const response = await puter.ai.chat(
    "Write a detailed tutorial on building a React application",
    {
      model: 'meta-llama/llama-4-maverick',
      stream: true
    }
  )
  
  for await (const part of response) {
    console.log(part?.text)
  }
}

streamLlamaResponse()

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    async function streamLlamaResponse() {
      const response = await puter.ai.chat(
        "Write a detailed tutorial on building a React application",
        {
          model: 'meta-llama/llama-4-maverick',
          stream: true
        }
      )
      
      for await (const part of response) {
        puter.print(part?.text)
      }
    }
    
    streamLlamaResponse()
  </script>
</body>
</html>
*/
```

#### Example 3: Using Different Llama Models for Different Needs

```javascript
// Using Llama 3.3 70B for complex tasks
puter.ai.chat(
  "Explain the implications of quantum computing on cryptography",
  { model: "meta-llama/llama-3.3-70b-instruct" }
).then(response => {
  console.log("Llama 3.3 70B:", response.message.content)
})

// Using Llama 3.1 8B for faster responses
puter.ai.chat(
  "Suggest three fun weekend activities",
  { model: "meta-llama/llama-3.1-8b-instruct" }
).then(response => {
  console.log("Llama 3.1 8B:", response.message.content)
})

// Using Llama Guard for content moderation
puter.ai.chat(
  "Is this message harmful: 'I enjoy hiking on weekends'",
  { model: "meta-llama/llama-guard-3-8b" }
).then(response => {
  console.log("Llama Guard:", response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    // Using Llama 3.3 70B for complex tasks
    puter.ai.chat(
      "Explain the implications of quantum computing on cryptography",
      { model: "meta-llama/llama-3.3-70b-instruct" }
    ).then(response => {
      puter.print("<h2>Using Llama 3.3 70B</h2>")
      puter.print(response.message.content)
    })
    
    // Using Llama 3.1 8B for faster responses
    puter.ai.chat(
      "Suggest three fun weekend activities",
      { model: "meta-llama/llama-3.1-8b-instruct" }
    ).then(response => {
      puter.print("<h2>Using Llama 3.1 8B</h2>")
      puter.print(response.message.content)
    })
    
    // Using Llama Guard for content moderation
    puter.ai.chat(
      "Is this message harmful: 'I enjoy hiking on weekends'",
      { model: "meta-llama/llama-guard-3-8b" }
    ).then(response => {
      puter.print("<h2>Using Llama Guard</h2>")
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 4: Image Analysis with Llama Vision Models

```javascript
// Analyze images with Llama vision capabilities
puter.ai.chat(
  "What do you see in this image?",
  "https://assets.puter.site/doge.jpeg",
  false,
  { model: 'meta-llama/llama-4-scout' }
).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat(
      "What do you see in this image?",
      "https://assets.puter.site/doge.jpeg",
      false,
      { model: 'meta-llama/llama-4-scout' }
    ).then(response => {
      document.write(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Available Llama Models

**Llama 4 Series:**
- `meta-llama/llama-4-maverick` - Latest Llama 4 model for general tasks
- `meta-llama/llama-4-maverick:free` - Free tier Llama 4 Maverick
- `meta-llama/llama-4-scout` - Llama 4 Scout with vision capabilities
- `meta-llama/llama-4-scout:free` - Free tier Llama 4 Scout

**Llama 3.3 Series:**
- `meta-llama/llama-3.3-70b-instruct` - Large 70B parameter model
- `meta-llama/llama-3.3-70b-instruct:free` - Free tier 70B model

**Llama 3.2 Series:**
- `meta-llama/llama-3.2-11b-vision-instruct` - 11B vision model
- `meta-llama/llama-3.2-11b-vision-instruct:free` - Free tier vision model
- `meta-llama/llama-3.2-90b-vision-instruct` - Large 90B vision model
- `meta-llama/llama-3.2-1b-instruct` - Lightweight 1B model
- `meta-llama/llama-3.2-3b-instruct` - Compact 3B model

**Llama 3.1 Series:**
- `meta-llama/llama-3.1-405b` - Massive 405B parameter model
- `meta-llama/llama-3.1-405b-instruct` - Instruction-tuned 405B model
- `meta-llama/llama-3.1-70b-instruct` - 70B instruction-tuned model
- `meta-llama/llama-3.1-8b-instruct` - Fast 8B instruction-tuned model

**Llama 3.0 Series:**
- `meta-llama/llama-3-70b-instruct` - Original Llama 3 70B model
- `meta-llama/llama-3-8b-instruct` - Original Llama 3 8B model

**Llama Guard Series (Content Moderation):**
- `meta-llama/llama-guard-2-8b` - Llama Guard 2 for content safety
- `meta-llama/llama-guard-3-8b` - Llama Guard 3 for content safety
- `meta-llama/llama-guard-4-12b` - Latest Llama Guard 4 model

#### Llama Model Capabilities

**General Capabilities:**
- **Open Source**: Based on Meta's open-source Llama models
- **High Performance**: Competitive with proprietary models
- **Code Generation**: Excellent at writing and explaining code
- **Multilingual Support**: Strong performance across multiple languages
- **Reasoning**: Good logical thinking and problem-solving
- **Creative Writing**: High-quality creative content generation

**Specialized Capabilities:**
- **Vision Models**: Image analysis and understanding (3.2 and 4 Scout series)
- **Content Moderation**: Safety and harmful content detection (Guard series)
- **Large Context**: Handle very long conversations and documents
- **Instruction Following**: Fine-tuned for following complex instructions

#### When to Use Llama Models

**Use Llama Models For:**
- Open-source AI applications and research
- Code generation and programming assistance
- Creative writing and content creation
- Educational applications and tutoring
- Multilingual content generation
- Applications requiring transparency and model interpretability
- Cost-effective AI solutions with good performance

**Model Selection Guide:**
- **Llama 4 Maverick**: Latest general-purpose model, best overall performance
- **Llama 4 Scout**: Vision capabilities for image analysis
- **Llama 3.3 70B**: Large model for complex reasoning tasks
- **Llama 3.1 8B**: Fast responses for real-time applications
- **Llama 3.2 Vision**: Image understanding and multimodal tasks
- **Llama Guard**: Content moderation and safety applications

#### Llama vs Other Models

**Llama Advantages:**
- **Open Source**: Transparent and customizable
- **Cost Effective**: Good performance at lower computational cost
- **Code Generation**: Excellent programming capabilities
- **Research Friendly**: Great for academic and research applications
- **Community Support**: Large open-source community

**When to Choose Llama:**
- Building open-source applications
- Need for model transparency
- Code-heavy applications
- Educational and research projects
- Budget-conscious applications
- Community-driven development







#### Example 1: Basic Text Generation with Liquid AI

```javascript
// Simple text generation with Liquid AI LFM
puter.ai.chat("What are the benefits of renewable energy?", {
  model: "liquid/lfm-7b"
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("What are the benefits of renewable energy?", {
      model: "liquid/lfm-7b"
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Streaming Responses with Liquid AI

```javascript
// Stream Liquid AI responses for real-time output
async function streamLiquidResponse() {
  const response = await puter.ai.chat(
    "Write a comprehensive explanation of machine learning algorithms",
    {
      model: 'liquid/lfm-7b',
      stream: true
    }
  )
  
  for await (const part of response) {
    if (part?.text) {
      console.log(part.text)
    }
  }
}

streamLiquidResponse()

// Complete HTML example
/*
<html>
<body>
  <div id="response"></div>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    async function streamResponse() {
      const outputDiv = document.getElementById('response')
      
      const response = await puter.ai.chat(
        "Write a comprehensive explanation of machine learning algorithms",
        {
          model: 'liquid/lfm-7b',
          stream: true
        }
      )
      
      for await (const part of response) {
        if (part?.text) {
          outputDiv.innerHTML += part.text
        }
      }
    }
    
    streamResponse()
  </script>
</body>
</html>
*/
```

#### Example 3: Multi-Message Conversations

```javascript
// Create conversational experiences with context
const conversationHistory = [
  {
    role: 'system',
    content: 'You are a helpful coding assistant specialized in JavaScript.'
  },
  {
    role: 'user',
    content: 'How do I create an async function in JavaScript?'
  },
  {
    role: 'assistant',
    content: 'You can create an async function using the async keyword before the function declaration...'
  },
  {
    role: 'user',
    content: 'Can you show me an example with error handling?'
  }
]

puter.ai.chat(conversationHistory, { model: 'liquid/lfm-3b' })
  .then(response => {
    console.log(response.message.content)
  })

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    const conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful coding assistant specialized in JavaScript.'
      },
      {
        role: 'user',
        content: 'How do I create an async function in JavaScript?'
      },
      {
        role: 'assistant',
        content: 'You can create an async function using the async keyword before the function declaration...'
      },
      {
        role: 'user',
        content: 'Can you show me an example with error handling?'
      }
    ]
    
    puter.ai.chat(conversationHistory, { model: 'liquid/lfm-3b' })
      .then(response => {
        puter.print(response.message.content)
      })
  </script>
</body>
</html>
*/
```

#### Example 4: Function Calling with Liquid AI

```javascript
// Define tools for the AI to use
const tools = [
  {
    type: "function",
    function: {
      name: "get_temperature",
      description: "Get current temperature for a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name e.g. Tokyo, London"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Perform mathematical calculations",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Mathematical expression to evaluate"
          }
        },
        required: ["expression"]
      }
    }
  }
]

// Mock functions
function getTemperature(location) {
  const mockData = {
    'Tokyo': '26°C',
    'London': '15°C',
    'New York': '22°C',
    'Paris': '19°C'
  }
  return mockData[location] || '18°C'
}

function calculate(expression) {
  try {
    return eval(expression).toString()
  } catch (error) {
    return "Invalid calculation"
  }
}

// Use function calling
async function handleFunctionCalling(userInput) {
  const completion = await puter.ai.chat(userInput, {
    tools: tools,
    model: 'liquid/lfm-7b'
  })
  
  // Check if AI wants to call a function
  if (completion.message.tool_calls?.length > 0) {
    const toolCall = completion.message.tool_calls[0]
    const args = JSON.parse(toolCall.function.arguments)
    let result
    
    if (toolCall.function.name === 'get_temperature') {
      result = getTemperature(args.location)
    } else if (toolCall.function.name === 'calculate') {
      result = calculate(args.expression)
    }
    
    // Send function result back to AI for final response
    const finalResponse = await puter.ai.chat([
      { role: "user", content: userInput },
      completion.message,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: result
      }
    ], { model: 'liquid/lfm-7b' })
    
    return finalResponse.message.content
  } else {
    return completion.message.content
  }
}

// Example usage
handleFunctionCalling("What's the current temperature in Tokyo?")
  .then(response => console.log(response))
```

#### Available Liquid AI Models

**Liquid AI Models via Puter.js:**
- `liquid/lfm-7b` - Liquid AI Large Foundation Model 7B parameters
- `liquid/lfm-3b` - Liquid AI Large Foundation Model 3B parameters

#### Liquid AI Model Capabilities

**Innovative Architecture:**
- **Liquid Neural Networks**: Based on Liquid AI's innovative liquid neural network architecture
- **Adaptive Computation**: Dynamic computational pathways for efficient processing
- **Memory Efficiency**: Optimized memory usage and computational efficiency
- **Scalable Design**: Architecture that scales efficiently across different model sizes

**Core Capabilities:**
- **Text Generation**: High-quality text generation for various applications
- **Code Understanding**: Strong performance on programming and technical tasks
- **Reasoning**: Good logical thinking and problem-solving abilities
- **Function Calling**: Support for external tool integration
- **Conversational AI**: Natural dialogue and multi-turn conversations
- **Context Awareness**: Maintains context across long conversations

#### When to Use Liquid AI Models

**Use Liquid AI Models For:**
- Applications requiring efficient computation
- Real-time AI applications with performance constraints
- Research into novel AI architectures
- Educational projects exploring different AI approaches
- Applications where memory efficiency is important
- Experimental AI applications and prototyping

**Model Selection Guide:**
- **liquid/lfm-7b**: Larger model for complex tasks requiring higher capability
- **liquid/lfm-3b**: Smaller, faster model for real-time applications and efficiency

#### Liquid AI Advantages

**Technical Innovation:**
- **Novel Architecture**: Based on cutting-edge liquid neural network research
- **Efficiency**: Optimized for computational and memory efficiency
- **Adaptability**: Dynamic computation based on input complexity
- **Research Value**: Access to innovative AI architecture for experimentation

**Practical Benefits:**
- **Performance**: Good balance of capability and efficiency
- **Speed**: Fast inference times due to optimized architecture
- **Resource Efficiency**: Lower computational requirements
- **Innovation**: Experience with next-generation AI architectures

#### When to Choose Liquid AI

**Choose Liquid AI For:**
- Performance-critical applications
- Research into novel AI architectures
- Applications with computational constraints
- Educational exploration of different AI approaches
- Prototyping and experimental projects
- Real-time applications requiring efficiency

**Liquid AI vs Other Models:**

| Feature | Liquid AI | Traditional Models |
|---------|-----------|-------------------|
| **Architecture** | Liquid Neural Networks | Transformer-based |
| **Efficiency** | High | Variable |
| **Innovation** | Cutting-edge | Established |
| **Research Value** | High | Moderate |
| **Computational Cost** | Lower | Higher |
| **Maturity** | Emerging | Mature |







#### Example 1: Basic Text Generation with Grok 4

```javascript
// Simple text generation with Grok 4
puter.ai.chat("Explain quantum computing in a witty and engaging way.", {
  model: 'x-ai/grok-4'
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain quantum computing in a witty and engaging way.", {
      model: 'x-ai/grok-4'
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Streaming Responses with Grok

```javascript
// Stream Grok responses for real-time output
async function streamGrokResponse() {
  const response = await puter.ai.chat(
    "Tell me a funny story about artificial intelligence.",
    {
      model: 'x-ai/grok-4',
      stream: true
    }
  )
  
  for await (const part of response) {
    console.log(part.text)
  }
}

streamGrokResponse()
```

#### Example 3: Multi-turn Conversations with Grok

```javascript
// Keep track of conversation history
let conversationHistory = []

async function continueConversation(userMessage) {
  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: userMessage
  })
  
  // Get response from Grok
  const response = await puter.ai.chat(conversationHistory, {
    model: 'x-ai/grok-4'
  })
  
  // Add Grok's response to history
  conversationHistory.push({
    role: "assistant",
    content: response.message.content
  })
  
  return response.message.content
}

// Example usage
const response1 = await continueConversation("What's the most interesting thing about space?")
const response2 = await continueConversation("Tell me more about that!")
```

#### Example 4: Function Calling with Grok

```javascript
// Define tools for Grok to use
const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather information for a specific location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city name (e.g., New York, London, Tokyo, Paris)"
        }
      },
      required: ["location"]
    }
  }
}]

// Mock weather function
function getWeather(location) {
  const weatherData = {
    'New York': { temp: '72°F', condition: 'Partly cloudy', humidity: '65%' },
    'London': { temp: '18°C', condition: 'Rainy', humidity: '80%' },
    'Tokyo': { temp: '28°C', condition: 'Sunny', humidity: '70%' },
    'Paris': { temp: '22°C', condition: 'Clear', humidity: '55%' }
  }
  return weatherData[location] || { temp: 'Unknown', condition: 'Data not available', humidity: 'Unknown' }
}

// Use function calling with Grok
async function handleQuery(userInput) {
  const completion = await puter.ai.chat(userInput, {
    model: 'x-ai/grok-4',
    tools: tools
  })
  
  // Check if Grok wants to call any functions
  if (completion.message.tool_calls && completion.message.tool_calls.length > 0) {
    const toolCall = completion.message.tool_calls[0]
    const args = JSON.parse(toolCall.function.arguments)
    
    if (toolCall.function.name === 'get_weather') {
      const weatherData = getWeather(args.location)
      
      // Send result back to Grok for final response
      const finalResponse = await puter.ai.chat([
        { role: "user", content: userInput },
        completion.message,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(weatherData)
        }
      ], { model: 'x-ai/grok-4' })
      
      return finalResponse.message.content
    }
  }
  
  return completion.message.content
}

// Example usage
handleQuery("What's the weather like in New York?").then(response => {
  console.log(response)
})
```

#### Available Grok Models

**Grok Models via Puter.js:**
- `x-ai/grok-2-1212` - Grok 2 model from December 2024
- `x-ai/grok-2-vision-1212` - Grok 2 with vision capabilities
- `x-ai/grok-3` - Latest Grok 3 model
- `x-ai/grok-3-beta` - Beta version of Grok 3
- `x-ai/grok-3-mini` - Lightweight Grok 3 model
- `x-ai/grok-3-mini-beta` - Beta version of Grok 3 Mini
- `x-ai/grok-4` - Most advanced Grok 4 model
- `x-ai/grok-4-fast:free` - Fast Grok 4 variant (free tier)
- `x-ai/grok-code-fast-1` - Code-specialized Grok model
- `x-ai/grok-vision-beta` - Vision-enabled Grok model

#### Grok Model Capabilities

- **Witty Responses**: Known for humor and engaging conversational style
- **Real-time Information**: Access to current events and real-time data
- **Code Generation**: Strong programming and technical capabilities
- **Creative Writing**: Excellent at creative and entertaining content
- **Problem Solving**: Unique approach to complex problem-solving
- **Vision Understanding**: Image analysis and multimodal capabilities
- **Function Calling**: Integration with external tools and APIs

#### When to Use Grok Models

**Use Grok Models For:**
- Conversational AI applications requiring personality
- Creative writing and entertainment content
- Real-time information and current events
- Interactive chatbots with engaging personalities
- Educational content with humor and wit
- Problem-solving with creative approaches
- Applications requiring up-to-date information







#### Example 1: Basic Text Generation with Cohere Command

```javascript
// Simple text generation with Cohere Command R Plus
puter.ai.chat("Explain the benefits of renewable energy", {
  model: "cohere/command-r-plus"
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain the benefits of renewable energy", {
      model: "cohere/command-r-plus"
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Using Different Cohere Models

```javascript
// Using Command R Plus model
puter.ai.chat(
  "Write a technical summary of machine learning algorithms",
  { model: "cohere/command-r-plus" }
).then(response => {
  console.log("Command R Plus:", response.message.content)
})

// Using Command R model
puter.ai.chat(
  "Explain quantum computing in simple terms",
  { model: "cohere/command-r" }
).then(response => {
  console.log("Command R:", response.message.content)
})

// Using Command R Plus 08-2024 model
puter.ai.chat(
  "Create a business plan outline for a sustainable technology startup",
  { model: "cohere/command-r-plus-08-2024" }
).then(response => {
  console.log("Command R Plus 08-2024:", response.message.content)
})
```

#### Example 3: Streaming Responses with Cohere

```javascript
// Stream Cohere responses for real-time output
async function streamCohere() {
  const response = await puter.ai.chat(
    "Write a detailed analysis of sustainable urban development practices",
    {
      stream: true,
      model: "cohere/command-r-plus"
    }
  )
  
  for await (const part of response) {
    console.log(part?.text)
  }
}

streamCohere()
```

#### Available Cohere Models

**Cohere Models via Puter.js:**
- `cohere/command` - Base Cohere Command model
- `cohere/command-a` - Cohere Command A variant
- `cohere/command-r` - Cohere Command R model
- `cohere/command-r-03-2024` - March 2024 Command R version
- `cohere/command-r-08-2024` - August 2024 Command R version
- `cohere/command-r-plus` - Most capable Command R Plus model
- `cohere/command-r-plus-04-2024` - April 2024 Command R Plus version
- `cohere/command-r-plus-08-2024` - August 2024 Command R Plus version
- `cohere/command-r7b-12-2024` - 7B parameter Command model from December 2024

#### Cohere Model Capabilities

- **Document Analysis**: Excellent at processing and analyzing long documents
- **Multilingual Processing**: Strong performance across multiple languages
- **Reasoning**: Advanced logical thinking and problem-solving
- **Business Applications**: Optimized for enterprise and business use cases
- **Retrieval Augmented Generation**: Enhanced with external knowledge integration
- **Summarization**: Excellent at condensing long content into key points
- **Classification**: Strong text classification and categorization capabilities

#### When to Use Cohere Models

**Use Cohere Models For:**
- Document analysis and processing
- Business intelligence and enterprise applications
- Multilingual content generation and translation
- Text summarization and content condensation
- Classification and categorization tasks
- Retrieval-augmented generation applications
- Professional and technical writing







#### Example 1: Basic Text Generation with Kimi K2

```javascript
// Simple text generation with Kimi K2
puter.ai.chat("Explain artificial intelligence in simple terms", {
  model: "moonshotai/kimi-k2"
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain artificial intelligence in simple terms", {
      model: "moonshotai/kimi-k2"
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Multilingual Conversation with Chinese Support

```javascript
// Chinese language processing with Kimi K2
puter.ai.chat("请用中文解释机器学习的基本概念，并举一个实际应用的例子。", {
  model: "moonshotai/kimi-k2"
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("请用中文解释机器学习的基本概念，并举一个实际应用的例子。", {
      model: "moonshotai/kimi-k2"
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 3: Streaming Responses with Kimi K2

```javascript
// Stream Kimi K2 responses for real-time output
async function streamKimiResponse() {
  const response = await puter.ai.chat(
    "Write a detailed comparison between traditional programming and AI-assisted development",
    {
      model: 'moonshotai/kimi-k2',
      stream: true
    }
  )
  
  for await (const part of response) {
    if (part?.text) {
      console.log(part.text)
    }
  }
}

streamKimiResponse()
```

#### Available Kimi K2 Models

**Kimi K2 Models via Puter.js:**
- `moonshotai/kimi-dev-72b:free` - Development version with 72B parameters (free tier)
- `moonshotai/kimi-k2` - Main Kimi K2 model
- `moonshotai/kimi-k2:free` - Free tier Kimi K2 model
- `moonshotai/kimi-k2-0905` - September 2024 version of Kimi K2
- `moonshotai/kimi-vl-a3b-thinking` - Vision-language model with thinking capabilities
- `moonshotai/kimi-vl-a3b-thinking:free` - Free tier vision-language model

#### Kimi K2 Model Capabilities

- **Multilingual Excellence**: Outstanding performance in Chinese and other languages
- **Long Context**: Ability to handle very long conversations and documents
- **Cultural Understanding**: Deep understanding of Chinese culture and context
- **Technical Proficiency**: Strong performance on technical and academic topics
- **Vision Capabilities**: Image analysis and understanding (VL models)
- **Reasoning**: Advanced logical thinking and problem-solving abilities

#### When to Use Kimi K2 Models

**Use Kimi K2 Models For:**
- Chinese language applications and content
- Multilingual applications requiring Chinese support
- Long-form content analysis and generation
- Technical documentation in Chinese
- Cross-cultural communication applications
- Educational content for Chinese-speaking users
- Business applications targeting Chinese markets







#### Example 1: Research with Perplexity Sonar

```javascript
// Perform research using Perplexity's Sonar model
puter.ai.chat("What are the latest developments in quantum computing research?", {
  model: "perplexity/sonar"
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("What are the latest developments in quantum computing research?", {
      model: "perplexity/sonar"
    }).then(response => {
      puter.print(response.message.content)
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Deep Research with Sonar Deep Research

```javascript
// Comprehensive analysis with Perplexity's deep research model
puter.ai.chat(
  "Analyze the environmental impact of electric vehicle adoption over the next decade",
  { model: "perplexity/sonar-deep-research" }
).then(response => {
  console.log(response.message.content)
})
```

#### Example 3: Professional Research with Sonar Pro

```javascript
// Professional-grade research capabilities
puter.ai.chat(
  "Provide a comprehensive market analysis for renewable energy investments in emerging markets",
  { model: "perplexity/sonar-pro" }
).then(response => {
  console.log(response.message.content)
})
```

#### Example 4: Streaming Research Results

```javascript
// Stream comprehensive research queries for real-time results
async function streamResearch() {
  const response = await puter.ai.chat(
    "Conduct a thorough analysis of the global semiconductor supply chain and its vulnerabilities",
    {
      stream: true,
      model: "perplexity/sonar-deep-research"
    }
  )
  
  for await (const part of response) {
    console.log(part?.text)
  }
}

streamResearch()
```

#### Available Perplexity AI Models

**Perplexity AI Models via Puter.js:**
- `perplexity/r1-1776` - Historical reasoning model
- `perplexity/sonar` - Base Sonar research model
- `perplexity/sonar-deep-research` - Comprehensive research capabilities
- `perplexity/sonar-pro` - Professional-grade research model
- `perplexity/sonar-reasoning` - Advanced reasoning capabilities
- `perplexity/sonar-reasoning-pro` - Professional reasoning model

#### Perplexity AI Model Capabilities

- **Research Excellence**: Specialized in conducting thorough research and analysis
- **Real-time Information**: Access to current and up-to-date information
- **Factual Accuracy**: Focus on providing well-researched, factual responses
- **Citation Support**: Ability to reference sources and provide citations
- **Complex Analysis**: Deep analysis of multifaceted topics
- **Professional Insights**: Business and academic-level research capabilities

#### When to Use Perplexity AI Models

**Use Perplexity AI Models For:**
- Market research and business analysis
- Academic research and literature reviews
- Current events and news analysis
- Scientific research and technical analysis
- Fact-checking and verification
- Comprehensive topic exploration
- Professional consulting and advisory applications



#### What is OpenRouter?

OpenRouter is a platform that simplifies access to a wide range of AI models through a single, unified API. It acts as a gateway between your application and various AI providers, handling authentication and routing so you don't have to maintain multiple API keys or manage complex integrations.





#### Example 1: Basic Text Generation with Llama 3

```javascript
// Use Meta's Llama 3 model through OpenRouter
puter.ai.chat("Explain quantum computing in simple terms", {
  model: 'openrouter:meta-llama/llama-3.1-8b-instruct'
}).then(response => {
  console.log(response.message.content)
})

// Complete HTML example
/*
<html>
<body>
  <script src="https://js.puter.com/v2/"></script>
  <script>
    puter.ai.chat("Explain quantum computing in simple terms", {
      model: 'openrouter:meta-llama/llama-3.1-8b-instruct'
    }).then(response => {
      document.body.innerHTML = response.message.content
    })
  </script>
</body>
</html>
*/
```

#### Example 2: Streaming with Claude Sonnet 4

```javascript
// Stream responses from Anthropic's Claude Sonnet 4
async function streamResponse() {
  const response = await puter.ai.chat(
    "Write a short story about a robot that discovers emotions",
    {
      model: 'openrouter:anthropic/claude-sonnet-4',
      stream: true
    }
  )
  
  for await (const part of response) {
    if (part?.text) {
      console.log(part.text)
    }
  }
}

streamResponse()
```

#### Example 3: Model Selection Interface

```javascript
// Create interface for selecting different OpenRouter models
const models = [
  'openrouter:meta-llama/llama-3.1-8b-instruct',
  'openrouter:anthropic/claude-3.5-sonnet',
  'openrouter:mistralai/mistral-7b-instruct',
  'openrouter:google/gemini-pro-1.5',
  'openrouter:openai/gpt-4o-mini'
]

async function generateWithModel(prompt, modelName) {
  try {
    const response = await puter.ai.chat(prompt, { model: modelName })
    return response.message.content
  } catch (error) {
    return `Error: ${error.message}`
  }
}

// Example usage
generateWithModel("Explain how solar panels work.", models[0])
  .then(response => console.log(response))
```

#### Available OpenRouter Models (Sample)

**Popular OpenRouter Models via Puter.js:**
- `openrouter:anthropic/claude-3.5-sonnet` - Anthropic's Claude 3.5 Sonnet
- `openrouter:openai/gpt-4o` - OpenAI's GPT-4o
- `openrouter:meta-llama/llama-3.1-405b-instruct` - Meta's largest Llama model
- `openrouter:google/gemini-2.0-flash-001` - Google's Gemini 2.0 Flash
- `openrouter:mistralai/mistral-large` - Mistral's large model
- `openrouter:deepseek/deepseek-chat` - DeepSeek's chat model
- `openrouter:qwen/qwen-2.5-72b-instruct` - Qwen's 72B model
- `openrouter:cohere/command-r-plus` - Cohere's Command R Plus

*Note: OpenRouter provides access to hundreds of models. The full list includes models from OpenAI, Anthropic, Meta, Google, Mistral, DeepSeek, Qwen, Cohere, and many other providers.*

#### OpenRouter Model Categories

- **Text Generation**: GPT, Claude, Llama, Mistral, Qwen models
- **Code Generation**: Specialized coding models from various providers
- **Reasoning**: Advanced reasoning models like o1, DeepSeek-R1
- **Vision**: Multimodal models for image understanding
- **Specialized**: Domain-specific models for particular use cases

#### When to Use OpenRouter Models

**Use OpenRouter Models For:**
- Access to the latest models from multiple providers
- Comparing different AI models for your use case
- Accessing specialized models not available elsewhere
- Building applications that need model diversity
- Research and experimentation with different AI approaches

---

## File System API

The File System API provides comprehensive file and directory management with rich metadata through FSItem objects.

### Methods

```javascript
// File operations
const fsItem = await puter.fs.write(path, data, options)    // Create/update files
const blob = await puter.fs.read(path, options)             // Read file content
await puter.fs.delete(path, options)                        // Delete files/directories
const fsItem = await puter.fs.stat(path)                    // Get file information

// Directory operations
const fsItem = await puter.fs.mkdir(path, options)          // Create directories
const items = await puter.fs.readdir(path, options)         // List directory contents
const items = await puter.fs.list(path, options)            // Alternative listing method

// File management
await puter.fs.copy(source, destination, options)           // Copy files/directories
await puter.fs.move(source, destination, options)           // Move files/directories

// Advanced options
const options = {
  dedupeName: true,           // Auto-rename if file exists
  createMissingParents: true, // Create parent directories
  overwrite: false           // Prevent overwriting existing files
}
```

### puter.fs.write() - Detailed Reference

Writes data to a specified file path. This method is useful for creating new files or modifying existing ones in the Puter cloud storage.

**Syntax:**
```javascript
puter.fs.write(path)
puter.fs.write(path, data)
puter.fs.write(path, data, options)
```

**Parameters:**
- `path` (String, Required): The path to the file to write to. If path is not absolute, it will be resolved relative to the app's root directory.
- `data` (String|File|Blob, Optional): The data to write to the file.
- `options` (Object, Optional): Configuration object with properties:
  - `overwrite` (Boolean): Whether to overwrite the file if it already exists. Defaults to `true`.
  - `dedupeName` (Boolean): Whether to deduplicate the file name if it already exists. Defaults to `false`.
  - `createMissingParents` (Boolean): Whether to create missing parent directories. Defaults to `false`.

**Return Value:**
Returns a promise that resolves to the file object of the written file.

**Examples:**

```javascript
// Create a new file containing "Hello, world!"
const file = await puter.fs.write('hello.txt', 'Hello, world!')
console.log('File written successfully:', file.name)

// Create a new file with input coming from a file input
document.getElementById('file-input').addEventListener('change', async (event) => {
  try {
    const file = await puter.fs.write('hello.txt', event.target.files[0])
    console.log('File written successfully:', file.name)
  } catch (error) {
    console.error('Error writing file:', error)
  }
})

// Create a file with duplicate name handling
const file1 = await puter.fs.write('hello.txt', 'Hello, world!')
console.log(`File 1: ${file1.name}`)

// This will be automatically renamed to 'hello (1).txt' or similar
const file2 = await puter.fs.write('hello.txt', 'Hello, world!', { dedupeName: true })
console.log(`File 2: ${file2.name}`)

// Create a new file with missing parent directories
const file = await puter.fs.write('my-directory/another-directory/hello.txt', 'Hello, world!', { 
  createMissingParents: true 
})
console.log(`File created at: ${file.path}`)

// Write without overwriting existing files
try {
  const file = await puter.fs.write('existing-file.txt', 'New content', { overwrite: false })
  console.log('File written:', file.name)
} catch (error) {
  console.log('File already exists and overwrite is disabled')
}
```

### puter.fs.read() - Detailed Reference

Reads data from a file.

**Syntax:**
```javascript
puter.fs.read(path)
puter.fs.read(path, options)
```

**Parameters:**
- `path` (String, Required): Path of the file to read. If `path` is not absolute, it will be resolved relative to the app's root directory.
- `options` (Object, Optional): An object with the following properties:
  - `offset` (Number, Optional): The offset to start reading from.
  - `byte_count` (Number, Required if `offset` is provided): The number of bytes to read from the offset.

**Return Value:**
A `Promise` that will resolve to a `Blob` object containing the contents of the file.

**Examples:**
```javascript
// Read a file
const filename = 'hello.txt'
await puter.fs.write(filename, "Hello world! I'm a file!")
console.log(`"${filename}" created`)

// Read the file and print its contents
const blob = await puter.fs.read(filename)
const content = await blob.text()
console.log(`"${filename}" read (content: "${content}")`)
```

### puter.fs.mkdir() - Detailed Reference

Allows you to create a directory.

**Syntax:**
```javascript
puter.fs.mkdir(path)
puter.fs.mkdir(path, options)
```

**Parameters:**
- `path` (String, Required): The path to the directory to create. If path is not absolute, it will be resolved relative to the app's root directory.
- `options` (Object, Optional): The options for the `mkdir` operation. The following options are supported:
  - `overwrite` (Boolean): Whether to overwrite the directory if it already exists. Defaults to `false`.
  - `dedupeName` (Boolean): Whether to deduplicate the directory name if it already exists. Defaults to `false`.
  - `createMissingParents` (Boolean): Whether to create missing parent directories. Defaults to `false`.

**Return Value:**
Returns a promise that resolves to the directory object of the created directory.

**Examples:**
```javascript
// Create a directory with random name
const dirName = 'my-new-directory'
const directory = await puter.fs.mkdir(dirName)
console.log(`"${dirName}" created at ${directory.path}`)

// Create a directory with duplicate name handling
const dir1 = await puter.fs.mkdir('hello')
console.log(`Directory 1: ${dir1.name}`)

// This will be automatically renamed to 'hello (1)' or similar
const dir2 = await puter.fs.mkdir('hello', { dedupeName: true })
console.log(`Directory 2: ${dir2.name}`)

// Create a new directory with missing parent directories
const dir = await puter.fs.mkdir('my-directory/another-directory/hello', { 
  createMissingParents: true 
})
console.log(`Directory created at: ${dir.path}`)
```

### puter.fs.readdir() - Detailed Reference

Reads the contents of a directory, returning an array of items (files and directories) within it.

**Syntax:**
```javascript
puter.fs.readdir(path)
puter.fs.readdir(path, options)
puter.fs.readdir(options)
```

**Parameters:**
- `path` (String): The path to the directory to read. If `path` is not absolute, it will be resolved relative to the app's root directory.
- `options` (Object, Optional):
  - `options.path` (String, Optional): The path to the directory to read.
  - `options.uid` (String, Optional): The UID of the directory to read.

**Return Value:**
A `Promise` that resolves to an array of FSItem objects (files and directories) within the specified directory.

**Examples:**
```javascript
// Read a directory
const items = await puter.fs.readdir('./')
console.log(`Items in the directory: ${items.map(item => item.path)}`)
```

### puter.fs.rename() - Detailed Reference

Renames a file or directory to a new name.

**Syntax:**
```javascript
puter.fs.rename(path, newName)
```

**Parameters:**
- `path` (String, Required): The path to the file or directory to rename. If `path` is not absolute, it will be resolved relative to the app's root directory.
- `newName` (String, Required): The new name of the file or directory.

**Return Value:**
Returns a promise that resolves to the file or directory object of the renamed file or directory.

**Examples:**
```javascript
// Create and rename a file
await puter.fs.write('hello.txt', 'Hello, world!')
console.log('"hello.txt" created')

// Rename hello.txt to hello-world.txt
await puter.fs.rename('hello.txt', 'hello-world.txt')
console.log('"hello.txt" renamed to "hello-world.txt"')
```

### puter.fs.copy() - Detailed Reference

Copies a file or directory from one location to another.

**Syntax:**
```javascript
puter.fs.copy(source, destination)
puter.fs.copy(source, destination, options)
```

**Parameters:**
- `source` (String, Required): The path to the file or directory to copy.
- `destination` (String, Required): The path to the destination directory. If destination is a directory then the file or directory will be copied into that directory using the same name as the source file or directory. If the destination is a file, we overwrite if overwrite is `true`, otherwise we error.
- `options` (Object, Optional): The options for the `copy` operation. The following options are supported:
  - `overwrite` (Boolean): Whether to overwrite the destination file or directory if it already exists. Defaults to `false`.
  - `dedupeName` (Boolean): Whether to deduplicate the file or directory name if it already exists. Defaults to `false`.
  - `newName` (String): The new name to use for the copied file or directory. Defaults to `undefined`.

**Return Value:**
A `Promise` that will resolve to the copied file or directory. If the source file or directory does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a file and directory, then copy the file
const filename = 'hello.txt'
await puter.fs.write(filename, 'Hello, world!')
console.log(`Created file: "${filename}"`)

const dirname = 'my-directory'
await puter.fs.mkdir(dirname)
console.log(`Created directory: "${dirname}"`)

// Copy the file into the directory
const copiedFile = await puter.fs.copy(filename, dirname)
console.log(`Copied file: "${filename}" to directory "${dirname}"`)
```

### puter.fs.move() - Detailed Reference

Moves a file or a directory from one location to another.

**Syntax:**
```javascript
puter.fs.move(source, destination)
puter.fs.move(source, destination, options)
```

**Parameters:**
- `source` (String, Required): The path to the file or directory to move.
- `destination` (String, Required): The path to the destination directory. If destination is a directory then the file or directory will be moved into that directory using the same name as the source file or directory. If the destination is a file, we overwrite if overwrite is `true`, otherwise we error.
- `options` (Object, Optional): The options for the `move` operation. The following options are supported:
  - `overwrite` (Boolean): Whether to overwrite the destination file or directory if it already exists. Defaults to `false`.
  - `dedupeName` (Boolean): Whether to deduplicate the file or directory name if it already exists. Defaults to `false`.
  - `createMissingParents` (Boolean): Whether to create missing parent directories. Defaults to `false`.

**Return Value:**
A `Promise` that will resolve to the moved file or directory. If the source file or directory does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a file and directory, then move the file
const filename = 'hello.txt'
await puter.fs.write(filename, 'Hello, world!')
console.log(`Created file: ${filename}`)

const dirname = 'my-directory'
await puter.fs.mkdir(dirname)
console.log(`Created directory: ${dirname}`)

// Move the file into the directory
await puter.fs.move(filename, dirname)
console.log(`Moved file: ${filename} to directory ${dirname}`)

// Move a file and create missing parent directories
const newFilename = 'test.txt'
await puter.fs.write(newFilename, 'Hello, world!')
console.log(`Created file: ${newFilename}`)

const newDirname = 'non-existent-directory'
await puter.fs.move(newFilename, `${newDirname}/${newFilename}`, { 
  createMissingParents: true 
})
console.log(`Moved ${newFilename} to ${newDirname}`)
```

### puter.fs.stat() - Detailed Reference

This method allows you to get information about a file or directory.

**Syntax:**
```javascript
puter.fs.stat(path)
```

**Parameters:**
- `path` (String, Required): The path to the file or directory to get information about. If `path` is not absolute, it will be resolved relative to the app's root directory.

**Return Value:**
A `Promise` that resolves to the FSItem of the specified file or directory.

**Examples:**
```javascript
// Create a file and get its information
await puter.fs.write('hello.txt', 'Hello, world!')
console.log('hello.txt created')

// Get information about hello.txt
const file = await puter.fs.stat('hello.txt')
console.log(`hello.txt name: ${file.name}`)
console.log(`hello.txt path: ${file.path}`)
console.log(`hello.txt size: ${file.size}`)
console.log(`hello.txt created: ${file.created}`)
```

### puter.fs.delete() - Detailed Reference

Deletes a file or directory.

**Syntax:**
```javascript
puter.fs.delete(path)
puter.fs.delete(path, options)
```

**Parameters:**
- `path` (String, Required): Path of the file or directory to delete. If `path` is not absolute, it will be resolved relative to the app's root directory.
- `options` (Object, Optional): The options for the `delete` operation. The following options are supported:
  - `recursive` (Boolean): Whether to delete the directory recursively. Defaults to `true`.
  - `descendantsOnly` (Boolean): Whether to delete only the descendants of the directory and not the directory itself. Defaults to `false`.

**Return Value:**
A `Promise` that will resolve when the file or directory is deleted.

**Examples:**
```javascript
// Create and delete a file
const filename = 'test-file.txt'
await puter.fs.write(filename, 'Hello, world!')
console.log('File created successfully')

await puter.fs.delete(filename)
console.log('File deleted successfully')

// Create and delete a directory
const dirname = 'test-directory'
await puter.fs.mkdir(dirname)
console.log('Directory created successfully')

await puter.fs.delete(dirname)
console.log('Directory deleted successfully')
```

### puter.fs.getReadURL() - Detailed Reference

Generates a URL that can be used to read a file.

**Syntax:**
```javascript
puter.fs.getReadURL(path)
puter.fs.getReadURL(path, expiresIn)
```

**Parameters:**
- `path` (String, Required): The path to the file to read.
- `expiresIn` (Number, Optional): The number of seconds until the URL expires. If not provided, the URL will expire in 24 hours.

**Return Value:**
A promise that resolves to a URL that can be used to read the file.

**Examples:**
```javascript
// Generate a read URL for a file
const url = await puter.fs.getReadURL("~/myfile.txt")
console.log(`File URL: ${url}`)

// Generate a read URL with custom expiration
const urlWithExpiry = await puter.fs.getReadURL("~/myfile.txt", 3600) // 1 hour
console.log(`File URL (expires in 1 hour): ${urlWithExpiry}`)
```

### puter.fs.upload() - Detailed Reference

Given a number of local items, upload them to the Puter filesystem. This method provides a powerful, free alternative to traditional file upload solutions such as Amazon S3, Google Cloud Storage, Firebase Storage, or custom server-side implementations.

**Syntax:**
```javascript
puter.fs.upload(items)
puter.fs.upload(items, dirPath)
puter.fs.upload(items, dirPath, options)
```

**Parameters:**
- `items` (Array, Required): The items to upload to the Puter filesystem. `items` can be an `InputFileList`, `FileList`, `Array` of `File` objects, or an `Array` of `Blob` objects.
- `dirPath` (String, Optional): The path of the directory to upload the items to. If not set, the items will be uploaded to the app's root directory.
- `options` (Object, Optional): A set of key/value pairs that configure the upload process.

**Return Value:**
Returns a promise that resolves to an array of file objects of the uploaded files.

**Basic File Upload Example:**

This example demonstrates how to add file upload capabilities to your website for free, without any backend or server setup:

```html
<!DOCTYPE html>
<html>
<body>
    <input type="file" id="file-input">
    <button id="upload-button">Upload</button>
    <div id="result"></div>

    <script src="https://js.puter.com/v2/"></script>
    <script>
        document.getElementById('upload-button').addEventListener('click', async () => {
            const fileInput = document.getElementById('file-input')
            const resultDiv = document.getElementById('result')

            if (fileInput.files.length > 0) {
                try {
                    const uploadedFile = await puter.fs.upload(fileInput.files)
                    resultDiv.innerHTML = `File uploaded successfully! Path: ${uploadedFile[0].path}`
                } catch (error) {
                    resultDiv.innerHTML = `Error uploading file: ${error.message}`
                }
            } else {
                resultDiv.innerHTML = 'Please select a file to upload.'
            }
        })
    </script>
</body>
</html>
```

**Code Breakdown:**

1. **HTML Structure:**
   - `<input type="file" id="file-input">` - Creates a file input field for users to select files
   - `<button id="upload-button">Upload</button>` - Triggers the upload process
   - `<div id="result"></div>` - Displays feedback messages to the user

2. **JavaScript Implementation:**
   - **Event Listener:** `addEventListener('click', async () => {})` - Sets up asynchronous upload handling
   - **File Validation:** `if (fileInput.files.length > 0)` - Checks if files are selected
   - **Upload Process:** `await puter.fs.upload(fileInput.files)` - Handles the actual upload to cloud storage
   - **Success Feedback:** Displays the uploaded file's path in cloud storage
   - **Error Handling:** Catches and displays any upload errors
   - **User Guidance:** Prompts user to select a file if none is chosen

**Advanced Examples:**

```javascript
// Multiple file upload with progress feedback
const fileInput = document.getElementById('file-input')
fileInput.multiple = true  // Allow multiple file selection

document.getElementById('upload-button').addEventListener('click', async () => {
    const files = fileInput.files
    const resultDiv = document.getElementById('result')
    
    if (files.length > 0) {
        try {
            resultDiv.innerHTML = `Uploading ${files.length} files...`
            
            const uploadedFiles = await puter.fs.upload(files)
            
            let successMessage = `Successfully uploaded ${uploadedFiles.length} files:<br>`
            uploadedFiles.forEach(file => {
                successMessage += `- ${file.name} (${file.size} bytes)<br>`
            })
            resultDiv.innerHTML = successMessage
            
        } catch (error) {
            resultDiv.innerHTML = `Upload failed: ${error.message}`
        }
    } else {
        resultDiv.innerHTML = 'Please select files to upload.'
    }
})

// Upload to specific directory
const uploadToDirectory = async (files, directory) => {
    try {
        const uploadedFiles = await puter.fs.upload(files, directory)
        console.log(`Uploaded ${uploadedFiles.length} files to ${directory}`)
        return uploadedFiles
    } catch (error) {
        console.error(`Failed to upload to ${directory}:`, error)
        throw error
    }
}

// Usage examples
await uploadToDirectory(fileInput.files, '~/Documents')
await uploadToDirectory(fileInput.files, '~/Images')
await uploadToDirectory(fileInput.files, '~/Projects/MyApp')

// Drag and drop upload
const dropZone = document.getElementById('drop-zone')

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('drag-over')
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over')
})

dropZone.addEventListener('drop', async (e) => {
    e.preventDefault()
    dropZone.classList.remove('drag-over')
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
        try {
            const uploadedFiles = await puter.fs.upload(files)
            console.log('Drag and drop upload successful:', uploadedFiles)
        } catch (error) {
            console.error('Drag and drop upload failed:', error)
        }
    }
})
```

**Key Benefits:**

- **No Backend Required:** Upload files directly from the browser without server setup
- **Free Cloud Storage:** No costs for storage, bandwidth, or API usage
- **Instant Setup:** Just include the Puter.js script and start uploading
- **Secure:** Files are stored securely in Puter's cloud infrastructure
- **Cross-Platform:** Works in all modern browsers and devices
- **Scalable:** Handles single files or multiple file uploads seamlessly

### FSItem Object Structure

File system operations return FSItem objects with comprehensive metadata:

```javascript
// FSItem object structure
{
  id: "unique-identifier",           // Unique file/directory ID
  uid: "unique-identifier",          // Alias for id
  name: "filename.js",               // File/directory name
  path: "/path/to/file.js",          // Full path
  is_dir: false,                     // true for directories
  parent_id: "parent-directory-id",  // Parent directory ID
  created: 1640995200,               // Unix timestamp
  modified: 1640995200,              // Unix timestamp
  accessed: 1640995200,              // Unix timestamp
  size: 1024,                        // Size in bytes (null for directories)
  writable: true                     // Write permissions
}
```

### Use Cases

- **File Management**: Build file managers and editors
- **Data Storage**: Store application data and user files
- **Content Management**: Manage documents, images, and media
- **Backup Systems**: Create backup and sync applications
- **Development Tools**: Build IDEs and code editors
- **Asset Management**: Handle static assets for web applications

---

## Key-Value Store API

The Key-Value Store API lets you store and retrieve data using key-value pairs in the cloud. It supports various operations such as set, get, delete, list keys, increment and decrement values, and flush data. This enables you to build powerful functionality into your app, including persisting application data, caching, storing configuration settings, and much more.

Puter.js handles all the infrastructure for you, so you don't need to set up servers, handle scaling, or manage backups. Each app has its own private key-value store within each user's account. Apps cannot access the key-value stores of other apps - only their own.

### Methods

```javascript
// Basic operations
await puter.kv.set(key, value)                              // Store data
const value = await puter.kv.get(key)                       // Retrieve data
await puter.kv.del(key)                                     // Delete data
await puter.kv.flush()                                      // Clear all data

// Numeric operations
const newValue = await puter.kv.incr(key)                   // Increment value
const newValue = await puter.kv.incr(key, amount)           // Increment by amount
const newValue = await puter.kv.decr(key)                   // Decrement value
const newValue = await puter.kv.decr(key, amount)           // Decrement by amount

// Advanced operations
const keys = await puter.kv.list()                          // List all keys
const keys = await puter.kv.list('pattern*')                // Pattern matching
const keyValues = await puter.kv.list(true)                 // Get keys and values
const keyValues = await puter.kv.list('pattern*', true)     // Pattern + values
```

### puter.kv.set() - Detailed Reference

When passed a key and a value, will add it to the user's key-value store, or update that key's value if it already exists.

**Syntax:**
```javascript
puter.kv.set(key, value)
```

**Parameters:**
- `key` (String, Required): A string containing the name of the key you want to create/update. The maximum allowed key size is **1 KB**.
- `value` (String|Number|Boolean|Object|Array, Required): The value you want to give the key you are creating/updating. The maximum allowed value size is **400 KB**.

**Return Value:**
A `Promise` that resolves to `true` when the key-value pair has been created or the existing key's value has been updated.

**Examples:**
```javascript
// Create a new key-value pair
const success = await puter.kv.set('name', 'Puter Smith')
console.log(`Key-value pair created/updated: ${success}`)

// Store different data types
await puter.kv.set('age', 25)                    // Number
await puter.kv.set('isActive', true)             // Boolean
await puter.kv.set('config', { theme: 'dark' })  // Object
await puter.kv.set('tags', ['web', 'app'])       // Array
```

### puter.kv.get() - Detailed Reference

When passed a key, will return that key's value, or `null` if the key does not exist.

**Syntax:**
```javascript
puter.kv.get(key)
```

**Parameters:**
- `key` (String, Required): A string containing the name of the key you want to retrieve the value of.

**Return Value:**
A `Promise` that will resolve to the key's value. If the key does not exist, it will resolve to `null`.

**Examples:**
```javascript
// Create and retrieve a key-value pair
await puter.kv.set('name', 'Puter Smith')
console.log("Key-value pair 'name' created/updated")

// Retrieve the value of key 'name'
const name = await puter.kv.get('name')
console.log(`Name is: ${name}`)

// Try to get a non-existent key
const missing = await puter.kv.get('nonexistent')
console.log(`Missing key value: ${missing}`) // null
```

### puter.kv.incr() - Detailed Reference

Increments the value of a key. If the key does not exist, it is initialized with 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer. This operation is limited to 64 bit signed integers.

**Syntax:**
```javascript
puter.kv.incr(key)
puter.kv.incr(key, amount)
```

**Parameters:**
- `key` (String, Required): The key of the value to increment.
- `amount` (Integer, Optional): The amount to increment the value by. Defaults to 1.

**Return Value:**
Returns the new value of the key after the increment operation.

**Examples:**
```javascript
// Increment by 1 (default)
const newValue = await puter.kv.incr('counter')
console.log(`New value: ${newValue}`) // 1 (if key didn't exist)

// Increment by specific amount
const newValue2 = await puter.kv.incr('counter', 5)
console.log(`New value: ${newValue2}`) // 6

// Use for page views, scores, etc.
await puter.kv.incr('page_views')
await puter.kv.incr('user_score', 10)
```

### puter.kv.decr() - Detailed Reference

Decrements the value of a key. If the key does not exist, it is initialized with 0 before performing the operation. An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer.

**Syntax:**
```javascript
puter.kv.decr(key)
puter.kv.decr(key, amount)
```

**Parameters:**
- `key` (String, Required): The key of the value to decrement.
- `amount` (Integer, Optional): The amount to decrement the value by. Defaults to 1.

**Return Value:**
Returns the new value of the key after the decrement operation.

**Examples:**
```javascript
// Decrement by 1 (default)
const newValue = await puter.kv.decr('lives')
console.log(`New value: ${newValue}`) // -1 (if key didn't exist)

// Decrement by specific amount
const newValue2 = await puter.kv.decr('inventory', 3)
console.log(`New value: ${newValue2}`)

// Use for countdown, inventory, etc.
await puter.kv.decr('remaining_attempts')
await puter.kv.decr('stock_count', 2)
```

### puter.kv.del() - Detailed Reference

When passed a key, will remove that key from the key-value storage. If there is no key with the given name in the key-value storage, nothing will happen.

**Syntax:**
```javascript
puter.kv.del(key)
```

**Parameters:**
- `key` (String, Required): A string containing the name of the key you want to remove.

**Return Value:**
A `Promise` that will resolve to `true` when the key has been removed.

**Examples:**
```javascript
// Create and delete a key-value pair
await puter.kv.set('name', 'Puter Smith')
console.log("Key-value pair 'name' created/updated")

// Delete the key 'name'
await puter.kv.del('name')
console.log("Key-value pair 'name' deleted")

// Try to retrieve the deleted key
const name = await puter.kv.get('name')
console.log(`Name is now: ${name}`) // null
```

### puter.kv.list() - Detailed Reference

Returns an array of all keys in the user's key-value store for the current app. If the user has no keys, the array will be empty.

**Syntax:**
```javascript
puter.kv.list()
puter.kv.list(pattern)
puter.kv.list(returnValues)
puter.kv.list(pattern, returnValues)
```

**Parameters:**
- `pattern` (String, Optional): If set, only keys that match the given pattern will be returned. The pattern can contain the `*` wildcard character, which matches any number of characters. For example, `abc*` will match all keys that start with `abc`. Default is `*`, which matches all keys.
- `returnValues` (Boolean, Optional): If set to `true`, the returned array will contain objects with both `key` and `value` properties. If set to `false`, the returned array will contain only the keys. Default is `false`.

**Return Value:**
A `Promise` that will resolve to an array of all keys (and values, if `returnValues` is set to `true`) in the user's key-value store for the current app.

**Examples:**
```javascript
// Create multiple key-value pairs
await puter.kv.set('name', 'Puter Smith')
await puter.kv.set('age', 21)
await puter.kv.set('isCool', true)
console.log("Key-value pairs created/updated")

// Retrieve all keys
const keys = await puter.kv.list()
console.log(`Keys are: ${keys}`) // ['name', 'age', 'isCool']

// Retrieve all keys and values
const keyVals = await puter.kv.list(true)
console.log('Keys and values:', keyVals.map(kv => `${kv.key} => ${kv.value}`))

// Match keys with a pattern
const keysMatchingPattern = await puter.kv.list('is*')
console.log(`Keys matching pattern: ${keysMatchingPattern}`) // ['isCool']

// Pattern matching with values
const userKeys = await puter.kv.list('user:*', true)
console.log('User data:', userKeys)
```

### puter.kv.flush() - Detailed Reference

Will remove all key-value pairs from the user's key-value store for the current app.

**Syntax:**
```javascript
puter.kv.flush()
```

**Parameters:**
None

**Return Value:**
A `Promise` that will resolve to `true` when the key-value store has been flushed (emptied). The promise will never reject.

**Examples:**
```javascript
// Create multiple key-value pairs
await puter.kv.set('name', 'Puter Smith')
await puter.kv.set('age', 21)
await puter.kv.set('isCool', true)
console.log("Key-value pairs created/updated")

// Check current keys
const keys = await puter.kv.list()
console.log(`Keys are: ${keys}`)

// Flush the key-value store
await puter.kv.flush()
console.log('Key-value store flushed')

// Verify all keys are gone
const keys2 = await puter.kv.list()
console.log(`Keys are now: ${keys2}`) // []
```

### Data Patterns

```javascript
// Hierarchical data organization
await puter.kv.set('user:123:profile', JSON.stringify(profile))
await puter.kv.set('user:123:settings', JSON.stringify(settings))
await puter.kv.set('user:123:preferences', JSON.stringify(preferences))

// Pattern-based queries
const userKeys = await puter.kv.list('user:123:*')          // All user data
const profiles = await puter.kv.list('user:*:profile', true) // All profiles

// Versioned data
await puter.kv.set('config:v1', JSON.stringify(configV1))
await puter.kv.set('config:v2', JSON.stringify(configV2))
const versions = await puter.kv.list('config:v*')           // All versions

// Counters and metrics
await puter.kv.incr('page_views')
await puter.kv.incr('api_calls')
await puter.kv.decr('remaining_credits')

// Feature flags and configuration
await puter.kv.set('feature:dark_mode', true)
await puter.kv.set('feature:beta_features', false)
const darkMode = await puter.kv.get('feature:dark_mode')
```

### Use Cases

- **Application Configuration**: Store app settings and preferences with easy retrieval
- **User Data**: Manage user profiles, preferences, and session data
- **Caching**: Cache API responses and computed data for performance
- **Feature Flags**: Control feature rollouts and A/B testing dynamically
- **Analytics**: Store usage metrics, page views, and tracking data
- **State Management**: Persist application state across sessions
- **Counters**: Track scores, views, downloads, and other numeric metrics
- **Inventory Management**: Track stock levels, quotas, and limits
- **Session Storage**: Store temporary user session information
- **Configuration Management**: Manage environment-specific settings

---

## UI API

The UI API enables rich interactive experiences with dialogs, file pickers, and window management.

### Methods

```javascript
// Dialog operations
await puter.ui.alert(message, buttons)                      // Custom alert dialogs
const result = await puter.ui.confirm(message, buttons)     // Confirmation dialogs
const input = await puter.ui.prompt(message, defaultValue)  // Input prompts

// File picker operations
const file = await puter.ui.showOpenFilePicker(options)     // File selection
const file = await puter.ui.showSaveFilePicker(data, filename) // File saving
const directory = await puter.ui.showDirectoryPicker(options)  // Directory selection

// Advanced UI components
const color = await puter.ui.showColorPicker(defaultColor, options)  // Color selection
const font = await puter.ui.showFontPicker(defaultFont, options)     // Font selection
puter.ui.showSpinner()                                               // Loading indicator
puter.ui.hideSpinner()                                               // Hide loading

// Window management
puter.ui.setWindowTitle(title)                              // Set window title
puter.ui.setWindowSize(width, height)                       // Set window size
puter.ui.setWindowPosition(x, y)                           // Set window position

// Social and sharing
await puter.ui.socialShare(url, message, options)          // Social media sharing
```

### Dialog Customization

```javascript
// Custom alert with multiple buttons
const result = await puter.ui.alert('Choose an action:', [
  { label: 'Save', value: 'save', type: 'primary' },
  { label: 'Cancel', value: 'cancel', type: 'secondary' },
  { label: 'Delete', value: 'delete', type: 'danger' }
])

// File picker with filters
const file = await puter.ui.showOpenFilePicker({
  accept: '.js,.json,.md',     // File type filters
  multiple: true,              // Multiple file selection
  startIn: 'desktop'          // Starting directory
})

// Color picker with options
const color = await puter.ui.showColorPicker('#ff0000', {
  allowTransparency: true,
  showPalette: true,
  title: 'Choose Brand Color'
})
```

### Use Cases

- **User Interaction**: Create interactive workflows and wizards
- **File Management**: Build file upload/download interfaces
- **Configuration**: Create settings and preference dialogs
- **Feedback**: Show progress, confirmations, and notifications
- **Customization**: Allow users to customize themes and appearance
- **Social Features**: Enable content sharing and collaboration

---

## Authentication API

The Authentication API provides comprehensive user management and session handling with secure, built-in authentication flows.

### Methods

```javascript
// Authentication operations
const user = await puter.auth.getUser()                    // Get current user info
const isSignedIn = puter.auth.isSignedIn()                // Check sign-in status
await puter.auth.signIn(options)                          // Sign in user
await puter.auth.signOut()                                // Sign out user
```

### User Data Structure

```javascript
// User object structure
{
  "username": "user123",                    // Username
  "email": "user@example.com",             // Email address
  "uid": "user-unique-id",                 // Unique user ID
  "created_at": "2025-01-01T00:00:00.000Z", // Account creation date
  "is_verified": true                      // Email verification status
}
```

### Free Auth API Tutorial

Puter.js provides a complete authentication system without requiring backend setup, API keys, or complex configuration. This tutorial shows how to build secure user authentication flows using Puter.js, perfect for web applications that need user management.

#### Getting Started with Authentication

```html
<script src="https://js.puter.com/v2/"></script>
```

#### Basic Authentication Check

```javascript
// Check if user is signed in
async function checkAuthStatus() {
  try {
    const isSignedIn = puter.auth.isSignedIn()
    
    if (isSignedIn) {
      const user = await puter.auth.getUser()
      console.log('User is signed in:', user)
      return user
    } else {
      console.log('User is not signed in')
      return null
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

// Initialize app with auth check
async function initializeApp() {
  const user = await checkAuthStatus()
  
  if (user) {
    showUserDashboard(user)
  } else {
    showLoginForm()
  }
}

initializeApp()
```

#### User Sign In and Sign Out

```javascript
// Sign in user with options
async function signInUser() {
  try {
    await puter.auth.signIn({
      // Optional: customize sign-in behavior
      // redirect_uri: window.location.href,
      // state: 'custom-state-data'
    })
    
    // User is now signed in
    const user = await puter.auth.getUser()
    console.log('Sign in successful:', user)
    
    // Update UI for signed-in user
    updateUIForSignedInUser(user)
    
  } catch (error) {
    console.error('Sign in failed:', error)
    showErrorMessage('Sign in failed. Please try again.')
  }
}

// Sign out user
async function signOutUser() {
  try {
    await puter.auth.signOut()
    console.log('User signed out successfully')
    
    // Update UI for signed-out state
    updateUIForSignedOutUser()
    
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}

// UI update functions
function updateUIForSignedInUser(user) {
  document.getElementById('login-section').style.display = 'none'
  document.getElementById('user-section').style.display = 'block'
  document.getElementById('username-display').textContent = user.username
  document.getElementById('email-display').textContent = user.email
}

function updateUIForSignedOutUser() {
  document.getElementById('login-section').style.display = 'block'
  document.getElementById('user-section').style.display = 'none'
}
```

#### Complete Authentication App

```html
<!DOCTYPE html>
<html>
<head>
  <title>Puter.js Authentication Demo</title>
  <script src="https://js.puter.com/v2/"></script>
  <style>
    .auth-container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .hidden { display: none; }
    .user-info { background: #f0f8ff; }
    .login-section { background: #fff8f0; }
    .btn { padding: 12px 24px; margin: 10px 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
    .btn:hover { background: #0056b3; }
    .btn-danger { background: #dc3545; }
    .btn-danger:hover { background: #c82333; }
    .user-details { margin: 15px 0; }
    .user-details div { margin: 8px 0; padding: 8px; background: white; border-radius: 4px; }
    .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
    .status.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .status.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  </style>
</head>
<body>
  <div class="auth-container">
    <h1>Puter.js Authentication Demo</h1>
    
    <div id="status-message" class="status hidden"></div>
    
    <!-- Login Section -->
    <div id="login-section" class="section login-section">
      <h2>Sign In Required</h2>
      <p>Please sign in to access your personalized dashboard and data.</p>
      <button class="btn" onclick="signInUser()">Sign In with Puter</button>
    </div>
    
    <!-- User Dashboard Section -->
    <div id="user-section" class="section user-info hidden">
      <h2>Welcome to Your Dashboard</h2>
      <div class="user-details">
        <div><strong>Username:</strong> <span id="username-display"></span></div>
        <div><strong>Email:</strong> <span id="email-display"></span></div>
        <div><strong>User ID:</strong> <span id="uid-display"></span></div>
        <div><strong>Account Created:</strong> <span id="created-display"></span></div>
        <div><strong>Verified:</strong> <span id="verified-display"></span></div>
      </div>
      
      <div>
        <button class="btn" onclick="refreshUserData()">Refresh User Data</button>
        <button class="btn" onclick="saveUserPreferences()">Save Preferences</button>
        <button class="btn btn-danger" onclick="signOutUser()">Sign Out</button>
      </div>
    </div>
    
    <!-- User Preferences Section -->
    <div id="preferences-section" class="section hidden">
      <h3>User Preferences</h3>
      <div>
        <label>Theme: 
          <select id="theme-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </div>
      <div style="margin-top: 10px;">
        <label>
          <input type="checkbox" id="notifications-checkbox"> Enable Notifications
        </label>
      </div>
      <div style="margin-top: 10px;">
        <label>Language: 
          <select id="language-select">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>
    </div>
  </div>

  <script>
    // Initialize app
    async function initializeApp() {
      showStatus('Checking authentication status...', 'info')
      
      try {
        const isSignedIn = puter.auth.isSignedIn()
        
        if (isSignedIn) {
          const user = await puter.auth.getUser()
          showUserDashboard(user)
          await loadUserPreferences()
          showStatus('Welcome back!', 'success')
        } else {
          showLoginSection()
          showStatus('Please sign in to continue', 'info')
        }
      } catch (error) {
        console.error('Initialization error:', error)
        showStatus('Error initializing app', 'error')
      }
    }

    // Sign in user
    async function signInUser() {
      showStatus('Signing in...', 'info')
      
      try {
        await puter.auth.signIn()
        const user = await puter.auth.getUser()
        showUserDashboard(user)
        await loadUserPreferences()
        showStatus('Sign in successful!', 'success')
      } catch (error) {
        console.error('Sign in error:', error)
        showStatus('Sign in failed. Please try again.', 'error')
      }
    }

    // Sign out user
    async function signOutUser() {
      showStatus('Signing out...', 'info')
      
      try {
        await puter.auth.signOut()
        showLoginSection()
        showStatus('Signed out successfully', 'success')
      } catch (error) {
        console.error('Sign out error:', error)
        showStatus('Sign out failed', 'error')
      }
    }

    // Refresh user data
    async function refreshUserData() {
      showStatus('Refreshing user data...', 'info')
      
      try {
        const user = await puter.auth.getUser()
        updateUserDisplay(user)
        showStatus('User data refreshed', 'success')
      } catch (error) {
        console.error('Refresh error:', error)
        showStatus('Failed to refresh user data', 'error')
      }
    }

    // Save user preferences
    async function saveUserPreferences() {
      showStatus('Saving preferences...', 'info')
      
      try {
        const preferences = {
          theme: document.getElementById('theme-select').value,
          notifications: document.getElementById('notifications-checkbox').checked,
          language: document.getElementById('language-select').value
        }
        
        // Save to Puter KV store
        await puter.kv.set('user_preferences', JSON.stringify(preferences))
        showStatus('Preferences saved successfully', 'success')
      } catch (error) {
        console.error('Save preferences error:', error)
        showStatus('Failed to save preferences', 'error')
      }
    }

    // Load user preferences
    async function loadUserPreferences() {
      try {
        const preferencesData = await puter.kv.get('user_preferences')
        
        if (preferencesData) {
          const preferences = JSON.parse(preferencesData)
          
          document.getElementById('theme-select').value = preferences.theme || 'light'
          document.getElementById('notifications-checkbox').checked = preferences.notifications || false
          document.getElementById('language-select').value = preferences.language || 'en'
          
          document.getElementById('preferences-section').classList.remove('hidden')
        }
      } catch (error) {
        console.error('Load preferences error:', error)
        // Show preferences section anyway
        document.getElementById('preferences-section').classList.remove('hidden')
      }
    }

    // UI helper functions
    function showLoginSection() {
      document.getElementById('login-section').classList.remove('hidden')
      document.getElementById('user-section').classList.add('hidden')
      document.getElementById('preferences-section').classList.add('hidden')
    }

    function showUserDashboard(user) {
      document.getElementById('login-section').classList.add('hidden')
      document.getElementById('user-section').classList.remove('hidden')
      updateUserDisplay(user)
    }

    function updateUserDisplay(user) {
      document.getElementById('username-display').textContent = user.username
      document.getElementById('email-display').textContent = user.email
      document.getElementById('uid-display').textContent = user.uid
      document.getElementById('created-display').textContent = new Date(user.created_at).toLocaleDateString()
      document.getElementById('verified-display').textContent = user.is_verified ? 'Yes' : 'No'
    }

    function showStatus(message, type) {
      const statusElement = document.getElementById('status-message')
      statusElement.textContent = message
      statusElement.className = `status ${type}`
      statusElement.classList.remove('hidden')
      
      // Auto-hide after 3 seconds for success messages
      if (type === 'success') {
        setTimeout(() => {
          statusElement.classList.add('hidden')
        }, 3000)
      }
    }

    // Initialize the app when page loads
    initializeApp()
  </script>
</body>
</html>
```

#### Protected Routes and Access Control

```javascript
// Create protected route system
class AuthGuard {
  static async requireAuth() {
    const isSignedIn = puter.auth.isSignedIn()
    
    if (!isSignedIn) {
      // Redirect to login or show login modal
      await this.redirectToLogin()
      return false
    }
    
    return true
  }
  
  static async redirectToLogin() {
    // Store current page for redirect after login
    localStorage.setItem('redirect_after_login', window.location.pathname)
    
    try {
      await puter.auth.signIn()
      
      // Redirect back to original page
      const redirectPath = localStorage.getItem('redirect_after_login')
      if (redirectPath) {
        localStorage.removeItem('redirect_after_login')
        window.location.pathname = redirectPath
      }
    } catch (error) {
      console.error('Login required but sign in failed:', error)
    }
  }
  
  static async getUserRole() {
    try {
      const user = await puter.auth.getUser()
      
      // Get user role from KV store or default to 'user'
      const roleData = await puter.kv.get(`user_role_${user.uid}`)
      return roleData || 'user'
    } catch (error) {
      console.error('Error getting user role:', error)
      return 'user'
    }
  }
  
  static async requireRole(requiredRole) {
    const hasAuth = await this.requireAuth()
    if (!hasAuth) return false
    
    const userRole = await this.getUserRole()
    const roleHierarchy = ['user', 'moderator', 'admin']
    
    const userRoleIndex = roleHierarchy.indexOf(userRole)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)
    
    if (userRoleIndex < requiredRoleIndex) {
      alert('Access denied: Insufficient permissions')
      return false
    }
    
    return true
  }
}

// Usage examples
async function loadUserDashboard() {
  if (await AuthGuard.requireAuth()) {
    // Load dashboard content
    console.log('Loading user dashboard...')
  }
}

async function loadAdminPanel() {
  if (await AuthGuard.requireRole('admin')) {
    // Load admin panel
    console.log('Loading admin panel...')
  }
}
```

#### User Session Management

```javascript
// Advanced session management
class SessionManager {
  static async initializeSession() {
    try {
      const isSignedIn = puter.auth.isSignedIn()
      
      if (isSignedIn) {
        const user = await puter.auth.getUser()
        
        // Update last activity
        await this.updateLastActivity(user.uid)
        
        // Set up activity tracking
        this.setupActivityTracking(user.uid)
        
        return user
      }
      
      return null
    } catch (error) {
      console.error('Session initialization error:', error)
      return null
    }
  }
  
  static async updateLastActivity(userId) {
    try {
      const timestamp = new Date().toISOString()
      await puter.kv.set(`last_activity_${userId}`, timestamp)
    } catch (error) {
      console.error('Error updating last activity:', error)
    }
  }
  
  static setupActivityTracking(userId) {
    // Track user activity
    const events = ['click', 'keypress', 'scroll', 'mousemove']
    
    const updateActivity = () => {
      this.updateLastActivity(userId)
    }
    
    // Throttle activity updates to once per minute
    const throttledUpdate = this.throttle(updateActivity, 60000)
    
    events.forEach(event => {
      document.addEventListener(event, throttledUpdate)
    })
  }
  
  static throttle(func, delay) {
    let timeoutId
    let lastExecTime = 0
    
    return function (...args) {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func.apply(this, args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }
  
  static async getSessionInfo(userId) {
    try {
      const lastActivity = await puter.kv.get(`last_activity_${userId}`)
      const sessionStart = await puter.kv.get(`session_start_${userId}`)
      
      return {
        lastActivity: lastActivity ? new Date(lastActivity) : null,
        sessionStart: sessionStart ? new Date(sessionStart) : null,
        isActive: this.isSessionActive(lastActivity)
      }
    } catch (error) {
      console.error('Error getting session info:', error)
      return null
    }
  }
  
  static isSessionActive(lastActivity) {
    if (!lastActivity) return false
    
    const now = new Date()
    const lastActivityTime = new Date(lastActivity)
    const timeDiff = now - lastActivityTime
    
    // Consider session active if last activity was within 30 minutes
    return timeDiff < 30 * 60 * 1000
  }
}

// Initialize session management
SessionManager.initializeSession().then(user => {
  if (user) {
    console.log('Session initialized for user:', user.username)
  }
})
```

#### Authentication Best Practices

**Security Guidelines:**
- **Always check authentication status** before accessing protected resources
- **Handle authentication errors gracefully** with user-friendly messages
- **Store sensitive data securely** using Puter's KV store, not localStorage
- **Implement proper session management** with activity tracking
- **Use role-based access control** for different user permissions

**User Experience Tips:**
- **Provide clear sign-in prompts** when authentication is required
- **Remember user preferences** across sessions using KV store
- **Show loading states** during authentication operations
- **Handle network errors** and provide retry options
- **Implement auto-refresh** for user data when needed

### Use Cases

- **User Management**: Build user registration and login systems
- **Personalization**: Create personalized user experiences
- **Access Control**: Implement role-based permissions
- **Session Management**: Handle user sessions and authentication
- **Multi-User Applications**: Build collaborative applications
- **Security**: Implement secure authentication flows

---

## Apps API

The Apps API enables creation and management of Puter applications.

### Methods

```javascript
// App management operations
const app = await puter.apps.create(name, indexURL, title, description)  // Create new app
const app = await puter.apps.get(name)                                   // Get app details (basic)
const app = await puter.apps.get(name, options)                          // Get app details (advanced)
const apps = await puter.apps.list(options)                             // List all apps
await puter.apps.delete(name)                                           // Delete app
const updatedApp = await puter.apps.update(name, attributes)            // Update app settings
```

### puter.apps.get() - Detailed Reference

**Syntax:**
```javascript
puter.apps.get(name)
puter.apps.get(name, options)
```

**Parameters:**
- `name` (String, Required): The name of the app to retrieve
- `options` (Object, Optional): Configuration object with properties:
  - `stats_period` (String): Period for user and open count statistics
    - Options: `today`, `yesterday`, `7d`, `30d`, `this_month`, `last_month`, `this_year`, `last_year`, `month_to_date`, `year_to_date`, `last_12_months`
    - Default: `all` (all time)
  - `icon_size` (Number): Size of icons to return
    - Options: `null`, `16`, `32`, `64`, `128`, `256`, `512`
    - Default: `null` (original size)

**Return Value:**
A `Promise` that resolves to an app object. If the app doesn't exist, the promise will be rejected.

**Examples:**
```javascript
// Basic app retrieval
const app = await puter.apps.get('my-app')
console.log(`App: ${app.name}, UID: ${app.uid}`)

// Get app with statistics for last 30 days
const appWithStats = await puter.apps.get('my-app', {
  stats_period: '30d',
  icon_size: 64
})
console.log(`App usage in last 30 days:`, appWithStats.stats)

// Get app with different icon sizes
const appWithIcon = await puter.apps.get('my-app', {
  icon_size: 128
})
console.log(`App icon URL:`, appWithIcon.icon)

// Error handling for non-existent apps
try {
  const app = await puter.apps.get('non-existent-app')
} catch (error) {
  console.error('App not found:', error.message)
}
```

### App Data Structure

```javascript
// Basic app object structure
{
  "name": "my-app",                         // App name
  "uid": "unique-app-id",                   // Unique app ID
  "title": "My Application",                // Display title
  "description": "App description",         // App description
  "index_url": "https://example.com",       // App URL
  "created_at": "2025-01-01T00:00:00.000Z"  // Creation timestamp
}

// Extended app object (with options)
{
  "name": "my-app",
  "uid": "unique-app-id", 
  "title": "My Application",
  "description": "App description",
  "index_url": "https://example.com",
  "created_at": "2025-01-01T00:00:00.000Z",
  "icon": "https://app-icon-url.com/icon-128.png",  // Icon URL (if icon_size specified)
  "stats": {                                        // Usage statistics (if stats_period specified)
    "user_count": 150,                              // Number of unique users
    "open_count": 1250,                             // Number of times opened
    "period": "30d"                                 // Statistics period
  }
}
```

### Advanced App Management Examples

```javascript
// Analytics dashboard for app usage
async function createAppAnalyticsDashboard(appName) {
  // Get app statistics for different periods
  const periods = ['today', '7d', '30d', 'this_month', 'last_month']
  const analytics = {}
  
  for (const period of periods) {
    const app = await puter.apps.get(appName, {
      stats_period: period,
      icon_size: 64
    })
    
    analytics[period] = {
      users: app.stats.user_count,
      opens: app.stats.open_count,
      period: app.stats.period
    }
  }
  
  // Display analytics
  console.log(`Analytics for ${appName}:`, analytics)
  
  // Calculate growth rates
  const weeklyGrowth = ((analytics['7d'].users - analytics['30d'].users) / analytics['30d'].users * 100).toFixed(2)
  console.log(`Weekly user growth: ${weeklyGrowth}%`)
  
  return analytics
}

// App icon management system
async function manageAppIcons(appName) {
  const iconSizes = [16, 32, 64, 128, 256, 512]
  const icons = {}
  
  for (const size of iconSizes) {
    const app = await puter.apps.get(appName, { icon_size: size })
    icons[`icon_${size}`] = app.icon
  }
  
  console.log(`Icons for ${appName}:`, icons)
  return icons
}

// App monitoring system
async function monitorAppHealth(appNames) {
  const healthReport = []
  
  for (const appName of appNames) {
    try {
      const app = await puter.apps.get(appName, {
        stats_period: 'today',
        icon_size: 32
      })
      
      healthReport.push({
        name: app.name,
        status: 'healthy',
        todayUsers: app.stats.user_count,
        todayOpens: app.stats.open_count,
        lastChecked: new Date().toISOString()
      })
    } catch (error) {
      healthReport.push({
        name: appName,
        status: 'error',
        error: error.message,
        lastChecked: new Date().toISOString()
      })
    }
  }
  
  return healthReport
}
```

### Use Cases

- **Application Management**: Create and manage web applications with detailed analytics
- **Multi-Tenant Systems**: Build separate apps for different users/organizations
- **Microservices**: Create specialized applications for specific functions
- **White-Label Solutions**: Build custom-branded applications with icon management
- **Development Tools**: Create development and management interfaces
- **Integration Platforms**: Build apps that integrate with external services
- **Analytics Dashboards**: Monitor app usage and performance metrics
- **Icon Management**: Handle multiple icon sizes for different display contexts
- **Health Monitoring**: Track app availability and usage patterns

---

## Hosting API

The Puter.js Hosting API enables you to deploy and manage websites on Puter's infrastructure programmatically. The API provides comprehensive hosting management features including creating, retrieving, listing, updating, and deleting deployments. With these capabilities, you can build powerful applications, such as website builders, static site generators, or deployment tools that require programmatic control over hosting infrastructure.

### Methods

```javascript
// Hosting operations
const site = await puter.hosting.create(subdomain, dirPath)    // Create hosting deployment
const site = await puter.hosting.get(subdomain)               // Get deployment details
const sites = await puter.hosting.list()                      // List all deployments
await puter.hosting.delete(subdomain)                         // Delete deployment
await puter.hosting.update(subdomain, dirPath)                // Update deployment
```

### puter.hosting.create() - Detailed Reference

Will create a new subdomain that will be served by the hosting service. Optionally, you can specify a path to a directory that will be served by the subdomain.

**Syntax:**
```javascript
puter.hosting.create(subdomain, dirPath)
```

**Parameters:**
- `subdomain` (String, Required): A string containing the name of the subdomain you want to create.
- `dirPath` (String, Optional): A string containing the path to the directory you want to serve. If not specified, the subdomain will be created without a directory.

**Return Value:**
A `Promise` that will resolve to a subdomain object when the subdomain has been created. If a subdomain with the given name already exists, the promise will be rejected with an error. If the path does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a simple website displaying "Hello world!"
const dirName = 'my-website'
await puter.fs.mkdir(dirName)

// Create 'index.html' in the directory with the contents "Hello, world!"
await puter.fs.write(`${dirName}/index.html`, '<h1>Hello, world!</h1>')

// Host the directory under a subdomain
const subdomain = 'my-awesome-site'
const site = await puter.hosting.create(subdomain, dirName)
console.log(`Website hosted at: https://${site.subdomain}.puter.site`)
```

### puter.hosting.list() - Detailed Reference

Returns an array of all subdomains in the user's subdomains that this app has access to. If the user has no subdomains, the array will be empty.

**Syntax:**
```javascript
puter.hosting.list()
```

**Parameters:**
None

**Return Value:**
A `Promise` that will resolve to an array of all subdomain objects belonging to the user that this app has access to.

**Examples:**
```javascript
// Create multiple websites and then list them
const site1 = await puter.hosting.create('site-one')
const site2 = await puter.hosting.create('site-two')
const site3 = await puter.hosting.create('site-three')

// Get all subdomains
const sites = await puter.hosting.list()
console.log('All websites:', sites.map(site => site.subdomain))

// Cleanup
await puter.hosting.delete('site-one')
await puter.hosting.delete('site-two')
await puter.hosting.delete('site-three')
```

### puter.hosting.delete() - Detailed Reference

Deletes a subdomain from your account. The subdomain will no longer be served by the hosting service. If the subdomain has a directory, it will be disconnected from the subdomain. The associated directory will not be deleted.

**Syntax:**
```javascript
puter.hosting.delete(subdomain)
```

**Parameters:**
- `subdomain` (String, Required): A string containing the name of the subdomain you want to delete.

**Return Value:**
A `Promise` that will resolve to `true` when the subdomain has been deleted. If a subdomain with the given name does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a website then delete it
const subdomain = 'temporary-site'
const site = await puter.hosting.create(subdomain)
console.log(`Website hosted at: ${site.subdomain}.puter.site`)

// Delete the website
await puter.hosting.delete(site.subdomain)
console.log('Website deleted')

// Try to retrieve the website (should fail)
try {
  await puter.hosting.get(site.subdomain)
} catch (error) {
  console.log('Website could not be retrieved - successfully deleted')
}
```

### puter.hosting.update() - Detailed Reference

Updates a subdomain to point to a new directory. If directory is not specified, the subdomain will be disconnected from its directory.

**Syntax:**
```javascript
puter.hosting.update(subdomain, dirPath)
```

**Parameters:**
- `subdomain` (String, Required): A string containing the name of the subdomain you want to update.
- `dirPath` (String, Optional): A string containing the path to the directory you want to serve. If not specified, the subdomain will be disconnected from its directory.

**Return Value:**
A `Promise` that will resolve to a subdomain object when the subdomain has been updated. If a subdomain with the given name does not exist, the promise will be rejected with an error. If the path does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a website
const subdomain = 'my-site'
const site = await puter.hosting.create(subdomain)
console.log(`Website hosted at: ${site.subdomain}.puter.site`)

// Create a new directory with content
const dirName = 'updated-content'
const dir = await puter.fs.mkdir(dirName)
await puter.fs.write(`${dirName}/index.html`, '<h1>Updated Content!</h1>')
console.log(`Created directory "${dir.path}"`)

// Update the site with the new directory
await puter.hosting.update(subdomain, dirName)
console.log(`Changed subdomain's root directory to "${dir.path}"`)

// Cleanup
await puter.hosting.delete(subdomain)
```

### puter.hosting.get() - Detailed Reference

Returns a subdomain. If the subdomain does not exist, the promise will be rejected with an error.

**Syntax:**
```javascript
puter.hosting.get(subdomain)
```

**Parameters:**
- `subdomain` (String, Required): A string containing the name of the subdomain you want to retrieve.

**Return Value:**
A `Promise` that will resolve to a subdomain object when the subdomain has been retrieved. If a subdomain with the given name does not exist, the promise will be rejected with an error.

**Examples:**
```javascript
// Create a website
const subdomain = 'my-info-site'
const site = await puter.hosting.create(subdomain)
console.log(`Website hosted at: ${site.subdomain}.puter.site`)

// Retrieve the website using get()
const retrievedSite = await puter.hosting.get(site.subdomain)
console.log(`Website retrieved: subdomain=${retrievedSite.subdomain}.puter.site UID=${retrievedSite.uid}`)

// Cleanup
await puter.hosting.delete(subdomain)
```

### Site Data Structure

```javascript
// Subdomain object structure
{
  "subdomain": "my-site",                   // Subdomain name
  "uid": "site-unique-id",                  // Unique site ID
  "url": "https://my-site.puter.site",      // Public URL
  "dir_path": "/path/to/site/files",        // Source directory path
  "created_at": "2025-01-01T00:00:00.000Z"  // Creation timestamp
}
```

### Use Cases

- **Static Websites**: Deploy and host static websites with custom content
- **Documentation Sites**: Host API documentation and technical guides
- **Landing Pages**: Create marketing and promotional pages
- **Portfolio Sites**: Build personal and professional portfolios
- **Demo Applications**: Showcase applications and prototypes
- **Status Pages**: Create public status and monitoring pages
- **Website Builders**: Build tools that programmatically create and deploy sites
- **Static Site Generators**: Integrate with build tools and deployment pipelines
- **Multi-tenant Applications**: Provide hosting capabilities to your users

---

## Networking API

The Puter.js Networking API lets you establish network connections directly from your frontend without requiring a server or a proxy, effectively giving you a full-featured networking API in the browser. `puter.net` provides both low-level socket connections via TCP socket and TLS socket, and high-level HTTP client functionality, such as `fetch`. One of the major benefits of `puter.net` is that it allows you to bypass CORS restrictions entirely, making it a powerful tool for developing web applications that need to make requests to external APIs.

### Methods

```javascript
// HTTP requests (CORS-free)
const response = await puter.net.fetch(url)                 // Basic HTTP request
const response = await puter.net.fetch(url, options)        // HTTP request with options
const text = await response.text()                          // Get response as text
const json = await response.json()                          // Get response as JSON
const blob = await response.blob()                          // Get response as blob

// Socket connections
const socket = new puter.net.Socket(hostname, port)         // Create TCP socket
const tlsSocket = new puter.net.tls.TLSSocket(hostname, port) // Create TLS socket

// Socket operations
socket.write(data)                                          // Send data
socket.close()                                              // Close connection

// Socket events
socket.on('open', callback)                                 // Socket ready
socket.on('data', callback)                                 // Data received
socket.on('error', callback)                                // Error occurred
socket.on('close', callback)                                // Socket closed
```

### puter.net.fetch() - Detailed Reference

The `puter.net.fetch()` API provides secure HTTP/HTTPS resource fetching without CORS restrictions. It's a drop-in replacement for the native fetch() API that bypasses browser CORS limitations.

**Syntax:**
```javascript
puter.net.fetch(url)
puter.net.fetch(url, options)
```

**Parameters:**
- `url` (String, Required): The URL of the resource to access (HTTP or HTTPS)
- `options` (Object, Optional): Standard RequestInit object with properties:
  - `method` (String): HTTP method (GET, POST, PUT, DELETE, etc.)
  - `headers` (Object): Request headers
  - `body` (String|FormData|Blob): Request body for POST/PUT requests
  - All other standard fetch options are supported

**Return Value:**
A `Promise` that resolves to a standard `Response` object with all standard methods:
- `response.text()` - Get response as text
- `response.json()` - Parse response as JSON
- `response.blob()` - Get response as binary blob
- `response.arrayBuffer()` - Get response as ArrayBuffer
- `response.ok` - Boolean indicating success (status 200-299)
- `response.status` - HTTP status code
- `response.headers` - Response headers

**Examples:**
```javascript
// Basic GET request (bypasses CORS)
const response = await puter.net.fetch("https://example.com")
const body = await response.text()
console.log(body)

// POST request with JSON data
const response = await puter.net.fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Post',
    body: 'This is a new post created with puter.net.fetch()',
    userId: 1
  })
})
const data = await response.json()
console.log(data)

// PUT request
const response = await puter.net.fetch('https://httpbin.org/put', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 1,
    title: 'Updated Post',
    body: 'This post was updated with puter.net.fetch()',
    userId: 1
  })
})

// DELETE request
const response = await puter.net.fetch('https://httpbin.org/delete', {
  method: 'DELETE'
})
const data = await response.json()
```

### puter.net.Socket() - Detailed Reference

Creates a TCP socket connection for low-level network communication.

**Syntax:**
```javascript
const socket = new puter.net.Socket(hostname, port)
```

**Parameters:**
- `hostname` (String, Required): The hostname or IP address to connect to
- `port` (Number, Required): The port number to connect to

**Methods:**
- `socket.write(data)` - Send data through the socket
- `socket.close()` - Close the socket connection

**Events:**
- `socket.on('open', callback)` - Socket connection established
- `socket.on('data', callback)` - Data received from server
- `socket.on('error', callback)` - Error occurred
- `socket.on('close', callback)` - Socket connection closed

**Examples:**
```javascript
// Connect to a server and send HTTP request
const socket = new puter.net.Socket("example.com", 80)

socket.on("open", () => {
  socket.write("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
})

const decoder = new TextDecoder()
socket.on("data", (data) => {
  console.log(decoder.decode(data))
})

socket.on("error", (reason) => {
  console.log("Socket errored with the following reason: ", reason)
})

socket.on("close", (hadError) => {
  console.log("Socket closed. Was there an error? ", hadError)
})
```

### puter.net.tls.TLSSocket() - Detailed Reference

Creates a secure TLS socket connection for encrypted low-level network communication.

**Syntax:**
```javascript
const socket = new puter.net.tls.TLSSocket(hostname, port)
```

**Parameters:**
- `hostname` (String, Required): The hostname or IP address to connect to
- `port` (Number, Required): The port number to connect to (typically 443 for HTTPS)

**Methods:**
- `socket.write(data)` - Send data through the encrypted socket
- `socket.close()` - Close the socket connection

**Events:**
- `socket.on('open', callback)` - Secure socket connection established
- `socket.on('data', callback)` - Encrypted data received from server
- `socket.on('error', callback)` - Error occurred
- `socket.on('close', callback)` - Socket connection closed

**Examples:**
```javascript
// Connect to a server with TLS encryption
const socket = new puter.net.tls.TLSSocket("example.com", 443)

socket.on("open", () => {
  socket.write("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
})

const decoder = new TextDecoder()
socket.on("data", (data) => {
  console.log(decoder.decode(data))
})

socket.on("error", (reason) => {
  console.log("Socket errored with the following reason: ", reason)
})

socket.on("close", (hadError) => {
  console.log("Socket closed. Was there an error? ", hadError)
})
```

### How It Works

The networking stack is built on the WISP protocol, a websocket-based proxy protocol built to relay and multiplex UDP and TCP sockets over a single WebSocket stream. The `puter.net.Socket` API is an interface which allows you to create a TCP stream over a WISP stream in a user-friendly way, while `puter.net.fetch` is a secure way to fetch external resources over a WISP stream.

Unlike contemporary CORS-proxies, with `puter.net.fetch()`, TLS is done client-side inside of the puter.js library with the help of rustls-wasm, allowing your connection to be fully secure. Puter servers never have access to any HTTPS resource sent through it over the appropriate Puter APIs.

### Key Features

- **CORS-Free Requests**: Bypass browser CORS restrictions entirely
- **TCP Sockets**: Low-level TCP socket connections for custom protocols
- **TLS Sockets**: Secure encrypted socket connections with client-side TLS
- **Full HTTP Client**: Complete HTTP client functionality
- **Direct Browser Access**: No server or proxy required
- **Custom Protocols**: Build custom network protocols and clients
- **Secure by Design**: Client-side TLS encryption ensures privacy
- **WebSocket Multiplexing**: Efficient connection management via WISP protocol

### Use Cases

- **API Testing Tools**: Build Postman-like applications that can test any API directly from the browser
- **Web Scrapers**: Create browser-based web scrapers that can fetch and parse HTML from any website
- **API Aggregators**: Combine data from multiple APIs (even ones without CORS support) into unified interfaces
- **Real-time Monitoring**: Pull data from various services and APIs directly for dashboards
- **Multi-service Integrations**: Connect to multiple third-party services directly from frontend
- **Custom Protocol Clients**: Build clients for custom network protocols using raw sockets
- **Proxy-free Applications**: Eliminate the need for backend proxies for external API access
- **Cross-domain Data Access**: Access resources from any domain without CORS limitations

// POST request with data
const response = await puter.net.fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})

// Handle different response types
const textResponse = await puter.net.fetch('https://example.com/text')
const text = await textResponse.text()

const binaryResponse = await puter.net.fetch('https://example.com/image.jpg')
const blob = await binaryResponse.blob()
const imageUrl = URL.createObjectURL(blob)

// Error handling
try {
  const response = await puter.net.fetch('https://api.example.com/data')
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  console.log(data)
} catch (error) {
  console.error('Fetch failed:', error)
}

// Using all standard RequestInit options
const response = await puter.net.fetch('https://api.example.com/upload', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'X-Custom-Header': 'value'
  },
  body: fileData,
  mode: 'cors',        // Note: CORS restrictions don't apply with puter.net.fetch
  cache: 'no-cache',
  credentials: 'include'
})
```

### TCP Socket Connections

The Socket API creates raw TCP socket connections directly in the browser.

**Syntax:**
```javascript
const socket = new puter.net.Socket(hostname, port)
```

**Parameters:**
- `hostname` (String, Required): Server hostname or IP address
- `port` (Number, Required): Port number to connect to

**Methods:**
- `socket.write(data)` - Write data to socket (ArrayBuffer | Uint8Array | string)
- `socket.close()` - Close the socket connection

**Events:**
- `socket.on('open', callback)` - Socket is ready to send data
- `socket.on('data', callback)` - Data received from server (callback receives Uint8Array)
- `socket.on('error', callback)` - Socket error occurred (callback receives error reason)
- `socket.on('close', callback)` - Socket closed (callback receives hadError boolean)

**Example:**
```javascript
const socket = new puter.net.Socket('example.com', 80)

socket.on('open', () => {
  socket.write('GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
})

const decoder = new TextDecoder()
socket.on('data', (data) => {
  console.log('Response:', decoder.decode(data))
})

socket.on('error', (reason) => {
  console.error('Socket error:', reason)
})

socket.on('close', (hadError) => {
  console.log('Socket closed. Error?', hadError)
})
```

### TLS Socket Connections

The TLS Socket API creates encrypted TCP socket connections using rustls-wasm.

**Syntax:**
```javascript
const tlsSocket = new puter.net.tls.TLSSocket(hostname, port)
```

**Parameters:**
- `hostname` (String, Required): Server hostname or IP address
- `port` (Number, Required): Port number to connect to

**Methods:**
- `socket.write(data)` - Write data to encrypted socket (String)
- `socket.close()` - Close the TLS socket connection

**Events:**
- `socket.on('open', callback)` - TLS socket is ready
- `socket.on('data', callback)` - Encrypted data received
- `socket.on('error', callback)` - TLS socket error
- `socket.on('close', callback)` - TLS socket closed

**Example:**
```javascript
const tlsSocket = new puter.net.tls.TLSSocket('example.com', 443)

tlsSocket.on('open', () => {
  tlsSocket.write('GET / HTTP/1.1\r\nHost: example.com\r\n\r\n')
})

const decoder = new TextDecoder()
tlsSocket.on('data', (data) => {
  console.log('Secure response:', decoder.decode(data))
})

tlsSocket.on('error', (reason) => {
  console.error('TLS socket error:', reason)
})

tlsSocket.on('close', (hadError) => {
  console.log('TLS socket closed. Error?', hadError)
})
```

### Advanced Networking Patterns

```javascript
// API client without CORS restrictions
class APIClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL
    this.apiKey = apiKey
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    const response = await puter.net.fetch(url, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// Usage
const client = new APIClient('https://api.external-service.com', 'your-api-key')
const userData = await client.get('/users/123')
const newUser = await client.post('/users', { name: 'Jane Doe' })
```

### Custom Protocol Implementation

```javascript
// Custom protocol over TCP
class CustomProtocolClient {
  constructor(hostname, port) {
    this.socket = new puter.net.Socket(hostname, port)
    this.connected = false
    this.messageQueue = []
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.socket.on('open', () => {
        // Send protocol handshake
        const handshake = JSON.stringify({
          type: 'handshake',
          version: '1.0',
          client: 'puter-client'
        }) + '\n'
        
        this.socket.write(handshake)
      })
      
      const decoder = new TextDecoder()
      this.socket.on('data', (data) => {
        const message = decoder.decode(data).trim()
        
        if (!this.connected) {
          // Handle handshake response
          const handshakeResponse = JSON.parse(message)
          if (handshakeResponse.status === 'ok') {
            this.connected = true
            resolve()
          } else {
            reject(new Error('Handshake failed'))
          }
        } else {
          // Handle regular messages
          this.messageQueue.push(JSON.parse(message))
        }
      })
      
      this.socket.on('error', (reason) => {
        reject(new Error(`Socket error: ${reason}`))
      })
    })
  }
  
  sendMessage(message) {
    if (!this.connected) {
      throw new Error('Not connected')
    }
    
    const packet = JSON.stringify({
      type: 'message',
      data: message,
      timestamp: Date.now()
    }) + '\n'
    
    this.socket.write(packet)
  }
  
  disconnect() {
    this.socket.close()
    this.connected = false
  }
}

// Usage
const client = new CustomProtocolClient('my-server.com', 8080)
await client.connect()
client.sendMessage('Hello, server!')
client.disconnect()
```

### Use Cases

- **API Integration**: Connect to external APIs without CORS limitations
- **Real-time Communication**: Build custom real-time protocols
- **Legacy System Integration**: Connect to older systems using custom protocols
- **IoT Communication**: Communicate with IoT devices and sensors
- **Game Networking**: Build multiplayer games with custom protocols
- **Data Streaming**: Stream data from external sources
- **Proxy Services**: Create proxy services for other applications
- **Network Monitoring**: Build network monitoring and diagnostic tools

---

## Drivers API

The Drivers API provides low-level access to Puter's driver system, allowing you to call any driver on any interface for advanced functionality and control.

### Methods

```javascript
// Driver operations
const result = await puter.drivers.call(interface, driver, method)        // Call driver method
const result = await puter.drivers.call(interface, driver, method, args)  // Call with arguments
```

### puter.drivers.call() - Detailed Reference

A low-level function that allows you to call any driver on any interface. This function is useful when you want to call a driver that is not directly exposed by Puter.js's high-level API or for when you need more control over the driver call.

**Syntax:**
```javascript
puter.drivers.call(interface, driver, method)
puter.drivers.call(interface, driver, method, args = {})
```

**Parameters:**

- `interface` (String, Required): The name of the interface you want to call
- `driver` (String, Required): The name of the driver you want to call  
- `method` (String, Required): The name of the method you want to call on the driver
- `args` (Object, Optional): An object containing the arguments you want to pass to the driver

**Return Value:**
A `Promise` that will resolve to the result of the driver call. The result can be of any type, depending on the driver you are calling. In case of an error, the `Promise` will reject with an error message.

**Examples:**
```javascript
// Call a custom driver method
const result = await puter.drivers.call('filesystem', 'local', 'readFile', {
  path: '/path/to/file.txt'
})

// Call system driver without arguments
const systemInfo = await puter.drivers.call('system', 'info', 'getVersion')

// Call network driver with configuration
const networkResult = await puter.drivers.call('network', 'http', 'request', {
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' }
})
```

**Use Cases:**
- **Advanced System Access**: Access low-level system functionality
- **Custom Drivers**: Interact with custom or third-party drivers
- **Driver Development**: Test and debug driver implementations
- **System Integration**: Build advanced integrations with Puter's core systems

---

## UI API Extensions

### AppConnection Class

The `AppConnection` class provides an interface for interaction with another app, enabling inter-app communication and control.

#### Attributes

- `usesSDK` (Boolean): Whether the target app is using Puter.js. If not, then some features of `AppConnection` will not be available.

#### Methods

**`on(eventName, handler)`**
Listen to an event from the target app. Possible events are:
- `message` - The target app sent us a message with `postMessage()`. The handler receives the message.
- `close` - The target app has closed. The handler receives an object with an `appInstanceID` field of the closed app.

**`off(eventName, handler)`**
Remove an event listener added with `on(eventName, handler)`.

**`postMessage(message)`**
Send a message to the target app. Think of it as a more limited version of [`window.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). `message` can be anything that [`window.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) would accept for its `message` parameter.

If the target app is not using the SDK, or the connection is not open, then nothing will happen.

**`close()`**
Attempt to close the target app. If you do not have permission to close it, or the target app is already closed, then nothing will happen.

An app has permission to close apps that it has launched with [`puter.ui.launchApp()`](/UI/launchApp).

#### Examples

**Interacting with another app:**
This example demonstrates two apps, `parent` and `child`, communicating with each other using `AppConnection`.

```html
<!-- Parent App -->
<html>
<head><title>Parent app</title></head>
<body>
<script src="https://js.puter.com/v2/"></script>
<script>
// This app is the parent
// Launch child (1)
const child = await puter.ui.launchApp('child');

// Listen to messages from the child app. (5)
child.on('message', msg => {
  console.log('Parent app received a message from child:', msg);
  console.log('Closing child app.');
  // Close the child (6)
  child.close();
});

// Send a message to the child (2)
child.postMessage('Hello!');
</script>
</body>
</html>

<!-- Child App -->
<html>
<head><title>Child app</title></head>
<body>
<script src="https://js.puter.com/v2/"></script>
<script>
// This app is the child
// Get a connection to our parent.
const parent = puter.ui.parentApp();

if (!parent) {
  // We were not launched by the parent.
  // For this example, we'll just exit.
  puter.exit();
} else {
  // We were launched by the parent, and can communicate with it.
  // Any time we get a message from the parent, show it in an alert dialog. (3)
  parent.on('message', msg => {
    puter.ui.alert(msg);
    // Send a message back (4)
    // Messages can be any JS object that can be cloned.
    parent.postMessage({
      name: 'Nyan Cat',
      age: 13
    });
  });
}
</script>
</body>
</html>
```

**Single app with multiple windows:**
Multi-window applications can also be implemented with a single app, by launching copies of itself that check if they have a parent and wait for instructions from it.

```html
<html>
<head><title>Traffic light</title>
<script src="https://js.puter.com/v2/"></script>
<script>
const parent = puter.ui.parentApp();

if (parent) {
  // We have a parent, so wait for it to tell us what to do.
  // In this example, just change the background color and display a message.
  parent.on('message', msg => {
    document.bgColor = msg.color;
    document.body.innerText = msg.text;
  });
} else {
  // `parent` is null, so we are the instance that should create and direct the child apps.
  const trafficLight = [{
    color: 'red',
    text: 'STOP',
  }, {
    color: 'yellow',
    text: 'WAIT',
  }, {
    color: 'green',
    text: 'GO',
  }];

  for (const data of trafficLight) {
    // Launch a child app for each task.
    puter.ui.launchApp('traffic-light').then(child => {
      child.postMessage(data);
    });
  }
}
</script>
</head>
</html>
```

---

## Data Models

### App Object

The App object represents a Puter application with its metadata and configuration.

#### Attributes

- `uid` (String): A string containing the unique identifier of the app. This is a unique identifier generated by Puter when the app is created.
- `name` (String): A string containing the name of the app.
- `icon` (String): A string containing the Data URL of the icon of the app. This is a base64 encoded image.
- `description` (String): A string containing the description of the app.
- `title` (String): A string containing the title of the app.
- `maximize_on_start` (Boolean, default: `false`): A boolean value indicating whether the app should be maximized when it is started.
- `index_url` (String): A string containing the URL of the index file of the app. This is the file that will be loaded when the app is started.
- `created_at` (String): A string containing the date and time when the app was created. The format of the date and time is `YYYY-MM-DDTHH:MM:SSZ`.
- `background` (Boolean, default: `false`): A boolean value indicating whether the app should run in the background. If this is set to `true`.
- `filetype_associations` (Array): An array of strings containing the file types that the app can open. Each string should be in the format `".<extension>"` or `"mime/type"`. e.g. `[".txt", "image/png"]`. For a directory association, the string should be `.directory`.
- `open_count` (Number): A number containing the number of times the app has been opened. If the `stats_period` option is set to a value other than `all`, this will be the number of times the app has been opened in that period.
- `user_count` (Number): A number containing the number of users that have access to the app. If the `stats_period` option is set to a value other than `all`, this will be the number of users that have access to the app in that period.

### Subdomain Object

The Subdomain object represents a hosted subdomain with its configuration and metadata.

#### Attributes

- `uid` (String): A string containing the unique identifier of the subdomain.
- `subdomain` (String): A string containing the name of the subdomain. This is the part of the domain that comes before the main domain name. e.g. in `example.puter.site`, `example` is the subdomain.
- `root_dir` (FSItem): An FSItem object representing the root directory of the subdomain. This is the directory where the files of the subdomain are stored.

---

## Utility Functions

Puter.js includes utility functions for common development tasks.

### Methods

```javascript
// Utility functions
puter.print(content)                    // Display content (development/debugging)
const randomName = puter.randName()     // Generate random names for testing
puter.exit()                           // Exit application (where applicable)
```

### Use Cases

- **Development**: Debug output and testing utilities
- **Testing**: Generate unique names for test resources
- **Prototyping**: Quick development and experimentation
- **Debugging**: Display information during development

---

## Advanced Integration Patterns

### Multi-API Application Development

Combining multiple Puter.js APIs creates powerful applications:

```javascript
// AI-Powered Application Generator
async function createAIApplication(description) {
  // 1. Generate application code using AI
  const codeResponse = await puter.ai.chat(
    `Generate a complete web application for: ${description}. Include HTML, CSS, and JavaScript.`,
    { model: 'gpt-5-nano' }
  );
  
  // 2. Create application directory
  const appName = puter.randName();
  await puter.fs.mkdir(appName);
  
  // 3. Save application files
  await puter.fs.write(`${appName}/index.html`, codeResponse.message.content);
  
  // 4. Deploy as hosted site
  const site = await puter.hosting.create(appName, appName);
  
  // 5. Create app entry
  const app = await puter.apps.create(
    appName,
    site.url,
    `AI Generated: ${description}`,
    `Application generated by AI for: ${description}`
  );
  
  // 6. Store metadata
  await puter.kv.set(`app_meta_${appName}`, JSON.stringify({
    description,
    generated: new Date().toISOString(),
    aiModel: 'gpt-5-nano',
    site: site,
    app: app
  }));
  
  // 7. Show success
  await puter.ui.alert(`Application created successfully!\n\nURL: ${site.url}`);
  
  return { app, site };
}

// Interactive File Manager
async function createFileManager() {
  // 1. Get user authentication
  const user = await puter.auth.getUser();
  if (!user) {
    await puter.auth.signIn();
  }
  
  // 2. Show file picker for directory selection
  const directory = await puter.ui.showDirectoryPicker();
  
  // 3. List directory contents
  const files = await puter.fs.list(directory.path);
  
  // 4. Create interactive file list
  const fileList = files.map(file => ({
    label: `${file.name} ${file.is_dir ? '📁' : '📄'} (${file.size || 0} bytes)`,
    value: file.path
  }));
  
  // 5. Let user select action
  const action = await puter.ui.confirm('Choose an action:', [
    { label: 'View File', value: 'view' },
    { label: 'Copy File', value: 'copy' },
    { label: 'Delete File', value: 'delete' },
    { label: 'Create Backup', value: 'backup' }
  ]);
  
  // 6. Handle user action
  switch (action) {
    case 'view':
      const selectedFile = await puter.ui.confirm('Select file to view:', fileList);
      const content = await puter.fs.read(selectedFile);
      const text = await content.text();
      await puter.ui.alert(`File Content:\n\n${text.substring(0, 500)}...`);
      break;
      
    case 'backup':
      const backupName = `backup-${Date.now()}`;
      await puter.fs.copy(directory.path, backupName);
      await puter.ui.alert(`Backup created: ${backupName}`);
      break;
  }
}

// Multi-User Collaboration System
async function createCollaborationSystem(projectName) {
  // 1. Authenticate user
  const user = await puter.auth.getUser();
  
  // 2. Create project structure
  const projectDir = `projects/${projectName}`;
  await puter.fs.mkdir(projectDir, { createMissingParents: true });
  
  // 3. Initialize project metadata
  const projectMeta = {
    name: projectName,
    owner: user.username,
    created: new Date().toISOString(),
    collaborators: [user.username],
    version: '1.0.0'
  };
  
  await puter.kv.set(`project:${projectName}:meta`, JSON.stringify(projectMeta));
  
  // 4. Create project documentation
  const docContent = await puter.ai.chat(
    `Create project documentation for: ${projectName}`,
    { model: 'gpt-5-nano' }
  );
  
  await puter.fs.write(`${projectDir}/README.md`, docContent.message.content);
  
  // 5. Deploy project site
  const site = await puter.hosting.create(`${projectName}-docs`, projectDir);
  
  // 6. Create project app
  const app = await puter.apps.create(
    `${projectName}-app`,
    site.url,
    projectName,
    `Collaboration project: ${projectName}`
  );
  
  // 7. Store project references
  await puter.kv.set(`project:${projectName}:resources`, JSON.stringify({
    directory: projectDir,
    site: site,
    app: app,
    documentation: `${projectDir}/README.md`
  }));
  
  return { projectMeta, site, app };
}

// External API Integration System
async function createAPIIntegrationSystem(apiConfig) {
  // 1. Test API connectivity without CORS restrictions
  const testResponse = await puter.net.fetch(`${apiConfig.baseUrl}/health`, {
    headers: { 'Authorization': `Bearer ${apiConfig.apiKey}` }
  });
  
  if (!testResponse.ok) {
    throw new Error('API connectivity test failed');
  }
  
  // 2. Create API client worker
  const clientCode = await puter.ai.chat(
    `Create a Puter.js worker that acts as an API client for ${apiConfig.name}. 
     Base URL: ${apiConfig.baseUrl}
     Include endpoints for CRUD operations and error handling.`,
    { model: 'gpt-5-nano' }
  );
  
  const clientFile = `api-clients/${apiConfig.name}-client.js`;
  await puter.fs.write(clientFile, clientCode.message.content, { createMissingParents: true });
  
  // 3. Deploy API client worker
  const worker = await puter.workers.create(`${apiConfig.name}-client`, clientFile);
  
  // 4. Create monitoring dashboard
  const dashboardCode = await puter.ai.chat(
    `Create an HTML dashboard for monitoring API ${apiConfig.name} with real-time status, 
     request logs, and performance metrics.`,
    { model: 'gpt-5-nano' }
  );
  
  const dashboardDir = `dashboards/${apiConfig.name}`;
  await puter.fs.mkdir(dashboardDir, { createMissingParents: true });
  await puter.fs.write(`${dashboardDir}/index.html`, dashboardCode.message.content);
  
  // 5. Deploy dashboard
  const dashboard = await puter.hosting.create(`${apiConfig.name}-dashboard`, dashboardDir);
  
  // 6. Store integration configuration
  const integrationConfig = {
    name: apiConfig.name,
    baseUrl: apiConfig.baseUrl,
    worker: worker,
    dashboard: dashboard,
    created: new Date().toISOString(),
    status: 'active'
  };
  
  await puter.kv.set(`integration:${apiConfig.name}`, JSON.stringify(integrationConfig));
  
  // 7. Set up monitoring
  const monitoringData = {
    lastCheck: new Date().toISOString(),
    status: 'healthy',
    responseTime: testResponse.headers.get('x-response-time') || 'unknown',
    requestCount: 0
  };
  
  await puter.kv.set(`monitoring:${apiConfig.name}`, JSON.stringify(monitoringData));
  
  return integrationConfig;
}
```

### Data Organization Patterns

```javascript
// Hierarchical data organization
await puter.kv.set(`app:${appName}:config`, JSON.stringify(config));
await puter.kv.set(`app:${appName}:users`, JSON.stringify(users));
await puter.kv.set(`app:${appName}:metrics`, JSON.stringify(metrics));

// Pattern-based queries
const appConfigs = await puter.kv.list('app:*:config', true);
const allUsers = await puter.kv.list('app:*:users', true);

// Versioned data management
await puter.kv.set(`data:${key}:v${version}`, JSON.stringify(data));
const versions = await puter.kv.list(`data:${key}:v*`);

// User-specific data
await puter.kv.set(`user:${userId}:preferences`, JSON.stringify(prefs));
await puter.kv.set(`user:${userId}:projects`, JSON.stringify(projects));
```

---

## Application Development Patterns

### Full-Stack Application Development

```javascript
// Complete application with all APIs
async function buildFullStackApp(appConfig) {
  // 1. User authentication
  const user = await puter.auth.getUser();
  
  // 2. AI-generated frontend
  const frontendCode = await puter.ai.chat(
    `Create a ${appConfig.type} application with ${appConfig.features.join(', ')}`,
    { model: 'gpt-5-nano' }
  );
  
  // 3. File system setup
  const appDir = `apps/${appConfig.name}`;
  await puter.fs.mkdir(appDir, { createMissingParents: true });
  await puter.fs.write(`${appDir}/index.html`, frontendCode.message.content);
  
  // 4. Backend worker
  const workerCode = await puter.ai.chat(
    `Create a Puter.js worker API for ${appConfig.name} with endpoints for ${appConfig.features.join(', ')}`,
    { model: 'gpt-5-nano' }
  );
  
  const workerFile = `${appDir}/api.js`;
  await puter.fs.write(workerFile, workerCode.message.content);
  const worker = await puter.workers.create(`${appConfig.name}-api`, workerFile);
  
  // 5. Static hosting
  const site = await puter.hosting.create(appConfig.name, appDir);
  
  // 6. App registration
  const app = await puter.apps.create(
    appConfig.name,
    site.url,
    appConfig.title,
    appConfig.description
  );
  
  // 7. Configuration storage
  const fullConfig = {
    ...appConfig,
    user: user.username,
    worker: worker,
    site: site,
    app: app,
    created: new Date().toISOString()
  };
  
  await puter.kv.set(`fullstack:${appConfig.name}`, JSON.stringify(fullConfig));
  
  // 8. Success notification
  await puter.ui.alert(
    `🚀 Full-stack application deployed!\n\n` +
    `Frontend: ${site.url}\n` +
    `API: ${worker.url}\n` +
    `Management: App registered as "${app.name}"`
  );
  
  return fullConfig;
}
```

### Enterprise Application Architecture

```javascript
// Enterprise-grade application with all features
async function createEnterpriseApplication(config) {
  // 1. Multi-user authentication setup
  const adminUser = await puter.auth.getUser();
  
  // 2. Create application structure
  const appStructure = {
    frontend: `${config.name}-frontend`,
    backend: `${config.name}-backend`, 
    docs: `${config.name}-docs`,
    admin: `${config.name}-admin`
  };
  
  // 3. Generate all components with AI
  const components = await Promise.all([
    puter.ai.chat(`Create enterprise frontend for ${config.description}`, { model: 'gpt-5-nano' }),
    puter.ai.chat(`Create enterprise API backend for ${config.description}`, { model: 'gpt-5-nano' }),
    puter.ai.chat(`Create comprehensive documentation for ${config.description}`, { model: 'gpt-5-nano' }),
    puter.ai.chat(`Create admin dashboard for ${config.description}`, { model: 'gpt-5-nano' })
  ]);
  
  // 4. Deploy all components
  const deployments = await Promise.all([
    deployComponent('frontend', components[0].message.content, appStructure.frontend),
    deployComponent('backend', components[1].message.content, appStructure.backend),
    deployComponent('docs', components[2].message.content, appStructure.docs),
    deployComponent('admin', components[3].message.content, appStructure.admin)
  ]);
  
  // 5. Configure enterprise features
  const enterpriseConfig = {
    name: config.name,
    admin: adminUser.username,
    components: appStructure,
    deployments: deployments,
    features: {
      authentication: true,
      multiTenant: true,
      analytics: true,
      backup: true,
      monitoring: true
    },
    created: new Date().toISOString()
  };
  
  await puter.kv.set(`enterprise:${config.name}`, JSON.stringify(enterpriseConfig));
  
  return enterpriseConfig;
}

async function deployComponent(type, code, name) {
  const dir = `enterprise/${name}`;
  await puter.fs.mkdir(dir, { createMissingParents: true });
  
  if (type === 'backend') {
    await puter.fs.write(`${dir}/index.js`, code);
    const worker = await puter.workers.create(name, `${dir}/index.js`);
    return { type, worker, url: worker.url };
  } else {
    await puter.fs.write(`${dir}/index.html`, code);
    const site = await puter.hosting.create(name, dir);
    const app = await puter.apps.create(name, site.url, name, `Enterprise ${type}`);
    return { type, site, app, url: site.url };
  }
}
```

---

## Best Practices and Patterns

### Error Handling

```javascript
// Comprehensive error handling
async function robustOperation() {
  try {
    // File operations with fallback
    let data;
    try {
      const file = await puter.fs.read('config.json');
      data = JSON.parse(await file.text());
    } catch (fsError) {
      console.warn('File not found, using defaults');
      data = await puter.kv.get('default_config') || {};
    }
    
    // AI operations with retry
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await puter.ai.chat('Process this data', { model: 'gpt-5-nano' });
        break;
      } catch (aiError) {
        if (attempt === 2) throw aiError;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    return response;
    
  } catch (error) {
    // User-friendly error reporting
    await puter.ui.alert(`Operation failed: ${error.message}`);
    throw error;
  }
}
```

### Performance Optimization

```javascript
// Efficient data operations
async function optimizedDataHandling() {
  // Batch KV operations
  const keys = ['user:1', 'user:2', 'user:3'];
  const userData = await puter.kv.list('user:*', true);
  
  // Parallel file operations
  const files = ['file1.txt', 'file2.txt', 'file3.txt'];
  const fileContents = await Promise.all(
    files.map(file => puter.fs.read(file))
  );
  
  // Streaming AI responses for better UX
  const stream = await puter.ai.chat('Long analysis task', { 
    stream: true,
    model: 'gpt-5-nano' 
  });
  
  for await (const chunk of stream) {
    // Process streaming response
    updateUI(chunk.text);
  }
}
```

---

## Conclusion

Puter.js provides a comprehensive cloud operating system that enables developers to build sophisticated applications with minimal infrastructure complexity. The platform combines:

- **Serverless Computing** with full API access
- **Artificial Intelligence** with 500+ models
- **Complete File System** with rich metadata
- **Persistent Storage** with pattern matching
- **Rich User Interfaces** with native dialogs
- **User Management** with authentication
- **Application Hosting** with custom domains
- **Development Tools** for rapid prototyping

This unified API approach eliminates the complexity of managing multiple cloud services, allowing developers to focus on building great applications rather than managing infrastructure.

Whether you're building simple tools, complex enterprise applications, or AI-powered services, Puter.js provides all the building blocks you need in a single, coherent platform.

## Complete Puter.js API Reference

Beyond the core APIs already covered, Puter.js provides additional specialized APIs for comprehensive platform integration:

### **Apps API - Application Management**

The Apps API enables creation and management of Puter applications:

```javascript
// App management operations
const app = await puter.apps.create(name, indexURL, title, description)  // Create new app
const app = await puter.apps.get(name, options)                          // Get app details
const apps = await puter.apps.list(options)                             // List all apps
await puter.apps.delete(name)                                           // Delete app
const updatedApp = await puter.apps.update(name, attributes)            // Update app settings

// App data structure
{
  "name": "my-app",
  "uid": "unique-app-id",
  "title": "My Application",
  "description": "App description",
  "index_url": "https://example.com",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Enhanced Worker Management Applications:**
- **Worker App Integration**: Create dedicated apps for specific worker management functions
- **Multi-Tenant Dashboards**: Separate apps for different user groups or organizations
- **Specialized Tools**: Create apps for worker monitoring, deployment, and analytics
- **White-Label Solutions**: Custom-branded worker management applications

### **Authentication API - User Management**

The Auth API provides comprehensive user authentication and session management:

```javascript
// Authentication operations
const user = await puter.auth.getUser()                    // Get current user info
const isSignedIn = puter.auth.isSignedIn()                // Check sign-in status
await puter.auth.signIn(options)                          // Sign in user
await puter.auth.signOut()                                // Sign out user

// User data structure
{
  "username": "user123",
  "email": "user@example.com",
  "uid": "user-unique-id",
  "created_at": "2025-01-01T00:00:00.000Z",
  "is_verified": true
}
```

**Enhanced Worker Management Applications:**
- **Role-Based Access Control**: Different permissions for worker management operations
- **User-Specific Dashboards**: Personalized worker management interfaces
- **Audit Logging**: Track user actions for security and compliance
- **Multi-User Collaboration**: Team-based worker management with user attribution

### **Hosting API - Static Site Deployment**

The Hosting API enables deployment and management of static websites:

```javascript
// Hosting operations
const site = await puter.hosting.create(subdomain, dirPath)    // Create hosting deployment
const site = await puter.hosting.get(subdomain)               // Get deployment details
const sites = await puter.hosting.list()                      // List all deployments
await puter.hosting.delete(subdomain)                         // Delete deployment
await puter.hosting.update(subdomain, dirPath)                // Update deployment

// Site data structure
{
  "subdomain": "my-site",
  "uid": "site-unique-id",
  "url": "https://my-site.puter.site",
  "dir_path": "/path/to/site/files",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Enhanced Worker Management Applications:**
- **Worker Documentation Sites**: Host documentation for worker APIs and usage
- **Status Pages**: Public status dashboards for worker health and performance
- **Landing Pages**: Marketing sites for worker services and APIs
- **Demo Applications**: Showcase worker capabilities with live examples

### **Extended UI API - Advanced Interface Components**

Beyond basic dialogs, the UI API includes specialized interface components:

```javascript
// Advanced UI components
const color = await puter.ui.showColorPicker(defaultColor, options)    // Color selection
const font = await puter.ui.showFontPicker(defaultFont, options)       // Font selection
puter.ui.showSpinner()                                                  // Loading indicator
puter.ui.hideSpinner()                                                  // Hide loading

// Window management
puter.ui.setWindowTitle(title)                                         // Set window title
puter.ui.setWindowSize(width, height)                                  // Set window size
puter.ui.setWindowPosition(x, y)                                       // Set window position

// UI component options
const colorOptions = {
  defaultColor: '#ff0000',
  allowTransparency: true,
  showPalette: true
}

const fontOptions = {
  defaultFont: 'Arial',
  categories: ['serif', 'sans-serif', 'monospace'],
  preview: 'Sample text'
}
```

**Enhanced Worker Management Applications:**
- **Theme Customization**: Allow users to customize dashboard colors and fonts
- **Branding Options**: Corporate color schemes and typography for enterprise users
- **Accessibility Features**: High contrast modes and font size adjustments
- **Loading States**: Professional loading indicators during worker operations

### **Utility Functions - Development Helpers**

Puter.js includes utility functions for common development tasks:

```javascript
// Utility functions
puter.print(content)                    // Display content (development/debugging)
const randomName = puter.randName()     // Generate random names for testing
puter.exit()                           // Exit application (where applicable)

// Usage examples
const workerName = puter.randName()     // Generate unique worker names
const testFile = `${puter.randName()}.js`  // Create unique test files
puter.print(`Worker ${workerName} created successfully`)  // Debug output
```

**Enhanced Worker Management Applications:**
- **Development Mode**: Debug output and testing utilities
- **Unique Naming**: Generate unique names for workers, files, and configurations
- **Testing Utilities**: Create test workers and configurations with random names
- **Development Feedback**: Real-time output during development and testing

## Advanced Multi-API Integration Patterns

### **Complete Worker Lifecycle Management**

Combining all Puter.js APIs for comprehensive worker management:

```javascript
// Complete worker management workflow
async function createCompleteWorkerSolution(description) {
  // 1. Authenticate user
  const user = await puter.auth.getUser()
  if (!user) {
    await puter.auth.signIn()
  }
  
  // 2. Generate worker code with AI
  const codeResponse = await puter.ai.chat(
    `Generate a Puter.js worker for: ${description}`,
    { model: 'gpt-5-nano' }
  )
  
  // 3. Create worker files
  const workerName = puter.randName()
  const fileName = `${workerName}.js`
  const fsItem = await puter.fs.write(fileName, codeResponse.message.content)
  
  // 4. Deploy worker
  const worker = await puter.workers.create(workerName, fileName)
  
  // 5. Create dedicated app for worker management
  const appName = `${workerName}-manager`
  const app = await puter.apps.create(
    appName,
    `https://worker-manager.puter.site`,
    `${workerName} Manager`,
    `Management interface for ${workerName} worker`
  )
  
  // 6. Create documentation site
  const docContent = await puter.ai.chat(
    `Generate HTML documentation for this worker: ${codeResponse.message.content}`,
    { model: 'gpt-5-nano' }
  )
  
  const docDir = `${workerName}-docs`
  await puter.fs.mkdir(docDir)
  await puter.fs.write(`${docDir}/index.html`, docContent.message.content)
  
  const docSite = await puter.hosting.create(`${workerName}-docs`, docDir)
  
  // 7. Store complete configuration in KV
  const config = {
    worker: worker,
    app: app,
    documentation: docSite,
    user: user.username,
    created: new Date().toISOString(),
    description: description
  }
  
  await puter.kv.set(`complete_worker_${workerName}`, JSON.stringify(config))
  
  // 8. Show success with custom UI
  const color = await puter.ui.showColorPicker('#00ff00')
  await puter.ui.alert(
    `✅ Complete worker solution created!\n\n` +
    `🔧 Worker: ${worker.url}\n` +
    `📱 Manager App: ${app.name}\n` +
    `📚 Documentation: https://${docSite.subdomain}.puter.site\n\n` +
    `All components are ready for use!`,
    [{ label: 'Open Worker', value: 'worker' }, { label: 'View Docs', value: 'docs' }]
  )
  
  return config
}

// Enterprise worker management with full API integration
async function createEnterpriseWorkerDashboard() {
  // 1. Create main dashboard app
  const dashboardApp = await puter.apps.create(
    'enterprise-worker-dashboard',
    'https://dashboard.example.com',
    'Enterprise Worker Dashboard',
    'Comprehensive worker management for enterprise users'
  )
  
  // 2. Set up user authentication and permissions
  const user = await puter.auth.getUser()
  const userPermissions = await puter.kv.get(`permissions_${user.username}`) || '[]'
  
  // 3. Create themed interface
  const brandColor = await puter.ui.showColorPicker('#0066cc', {
    title: 'Select Brand Color',
    allowTransparency: false
  })
  
  const brandFont = await puter.ui.showFontPicker('Inter', {
    categories: ['sans-serif'],
    preview: 'Enterprise Worker Dashboard'
  })
  
  // 4. Generate dashboard with AI
  puter.ui.showSpinner()
  
  const dashboardCode = await puter.ai.chat([
    {
      role: 'system',
      content: 'You are an expert web developer creating enterprise dashboards.'
    },
    {
      role: 'user',
      content: `Create a professional worker management dashboard with:
        - Brand color: ${brandColor}
        - Font family: ${brandFont.fontFamily}
        - User: ${user.username}
        - Permissions: ${userPermissions}
        - Real-time worker monitoring
        - Deployment management
        - Analytics and reporting`
    }
  ], { model: 'gpt-5-nano' })
  
  // 5. Deploy dashboard files
  const dashboardDir = 'enterprise-dashboard'
  await puter.fs.mkdir(dashboardDir, { createMissingParents: true })
  await puter.fs.write(`${dashboardDir}/index.html`, dashboardCode.message.content)
  
  // 6. Create hosting for dashboard
  const dashboardSite = await puter.hosting.create('enterprise-dashboard', dashboardDir)
  
  // 7. Store enterprise configuration
  const enterpriseConfig = {
    app: dashboardApp,
    site: dashboardSite,
    branding: { color: brandColor, font: brandFont },
    user: user,
    permissions: JSON.parse(userPermissions),
    created: new Date().toISOString()
  }
  
  await puter.kv.set('enterprise_config', JSON.stringify(enterpriseConfig))
  
  puter.ui.hideSpinner()
  
  // 8. Launch dashboard
  await puter.ui.alert(
    `🚀 Enterprise Dashboard Ready!\n\n` +
    `Access your dashboard at: https://${dashboardSite.subdomain}.puter.site\n\n` +
    `Features enabled:\n` +
    `• Real-time worker monitoring\n` +
    `• Deployment management\n` +
    `• Analytics and reporting\n` +
    `• Custom branding\n` +
    `• Role-based access control`,
    [{ label: 'Open Dashboard', value: 'open' }]
  )
  
  return enterpriseConfig
}
```

### **Cross-API Data Synchronization**

Synchronizing data across all Puter.js APIs for consistency:

```javascript
// Comprehensive data synchronization
async function syncWorkerDataAcrossAPIs(workerName) {
  // 1. Get worker details from Workers API
  const worker = await puter.workers.get(workerName)
  
  // 2. Get configuration from KV store
  const config = await puter.kv.get(`worker_config_${workerName}`)
  const parsedConfig = config ? JSON.parse(config) : {}
  
  // 3. Get file information from FS API
  const fileInfo = await puter.fs.stat(worker.file_path)
  
  // 4. Check for associated app
  const apps = await puter.apps.list()
  const associatedApp = apps.find(app => app.name.includes(workerName))
  
  // 5. Check for documentation site
  const sites = await puter.hosting.list()
  const docSite = sites.find(site => site.subdomain.includes(workerName))
  
  // 6. Get user information
  const user = await puter.auth.getUser()
  
  // 7. Create comprehensive worker profile
  const workerProfile = {
    // Core worker data
    worker: {
      name: worker.name,
      url: worker.url,
      file_path: worker.file_path,
      file_uid: worker.file_uid,
      created_at: worker.created_at
    },
    
    // File system data
    file: {
      id: fileInfo.id,
      name: fileInfo.name,
      path: fileInfo.path,
      size: fileInfo.size,
      created: fileInfo.created,
      modified: fileInfo.modified
    },
    
    // Configuration data
    configuration: parsedConfig,
    
    // Associated resources
    resources: {
      app: associatedApp || null,
      documentation: docSite || null
    },
    
    // User context
    owner: user.username,
    
    // Metadata
    lastSync: new Date().toISOString(),
    version: '1.0.0'
  }
  
  // 8. Store synchronized profile
  await puter.kv.set(`worker_profile_${workerName}`, JSON.stringify(workerProfile))
  
  // 9. Update search index for quick lookup
  const searchIndex = await puter.kv.get('worker_search_index') || '[]'
  const index = JSON.parse(searchIndex)
  
  const existingIndex = index.findIndex(item => item.name === workerName)
  const searchEntry = {
    name: workerName,
    url: worker.url,
    description: parsedConfig.description || '',
    tags: parsedConfig.tags || [],
    owner: user.username,
    lastUpdated: new Date().toISOString()
  }
  
  if (existingIndex >= 0) {
    index[existingIndex] = searchEntry
  } else {
    index.push(searchEntry)
  }
  
  await puter.kv.set('worker_search_index', JSON.stringify(index))
  
  return workerProfile
}
```

## Production-Ready Features

### **Enterprise Integration Capabilities**

The complete Puter.js API suite enables enterprise-grade features:

- **Single Sign-On (SSO)**: Integration with enterprise authentication systems
- **Multi-Tenant Architecture**: Isolated environments using Apps and KV namespacing
- **Comprehensive Audit Trails**: Track all operations across APIs with user attribution
- **Custom Branding**: White-label solutions with custom themes and domains
- **Role-Based Access Control**: Fine-grained permissions for different user types
- **Automated Deployment Pipelines**: CI/CD integration using Workers and Hosting APIs
- **Real-Time Monitoring**: Live dashboards with WebSocket integration
- **Backup and Recovery**: Automated backup strategies across all data stores
- **Compliance Reporting**: Generate compliance reports using stored audit data
- **Performance Analytics**: Track usage patterns and optimize resource allocation

### **Developer Experience Enhancements**

- **Integrated Development Environment**: Code editors with syntax highlighting
- **Live Debugging**: Real-time debugging tools for worker development
- **API Documentation Generation**: Automatic documentation from worker code
- **Testing Frameworks**: Automated testing for worker functionality
- **Version Control Integration**: Git-like versioning for all resources
- **Collaborative Development**: Team-based development with shared resources
- **Template Marketplace**: Reusable templates for common worker patterns
- **Performance Profiling**: Detailed performance analysis and optimization
- **Error Tracking**: Comprehensive error logging and alerting
- **Usage Analytics**: Detailed analytics for API usage and performance

This complete API integration demonstrates that Puter.js is not just a serverless platform, but a comprehensive cloud operating system that enables building sophisticated, enterprise-grade applications with minimal infrastructure complexity.
--
-

## Puter.js vs Lovable Cloud: The Complete Alternative

Puter.js provides a comprehensive, free alternative to Lovable Cloud and other expensive cloud development platforms. This comparison shows why Puter.js is the superior choice for modern web development.

### Platform Comparison

| Feature | Puter.js | Lovable Cloud | Advantage |
|---------|----------|---------------|-----------|
| **Cost** | Completely Free | $20-200+/month | ✅ Puter.js |
| **API Keys** | None Required | Required | ✅ Puter.js |
| **Setup Time** | Instant (1 script tag) | Complex setup | ✅ Puter.js |
| **AI Models** | 500+ models free | Limited, paid | ✅ Puter.js |
| **File Storage** | Unlimited free | Limited, paid tiers | ✅ Puter.js |
| **Serverless Functions** | Free workers | Paid compute | ✅ Puter.js |
| **Database** | Built-in KV store | Separate service | ✅ Puter.js |
| **Authentication** | Built-in, free | Third-party required | ✅ Puter.js |
| **Hosting** | Free static hosting | Paid hosting | ✅ Puter.js |
| **Learning Curve** | Minimal | Steep | ✅ Puter.js |

### Why Choose Puter.js Over Lovable Cloud

#### 1. **Zero Cost, Maximum Value**

```javascript
// Puter.js - Completely free
<script src="https://js.puter.com/v2/"></script>

// Everything included:
// - AI models (500+)
// - File storage
// - Database
// - Authentication
// - Serverless functions
// - Static hosting
// - No credit card required
```

**Lovable Cloud Alternative:**
- Monthly subscription fees
- Usage-based pricing
- Credit card required
- Limited free tier

#### 2. **Instant Setup vs Complex Configuration**

```javascript
// Puter.js - Ready in seconds
<!DOCTYPE html>
<html>
<head>
  <script src="https://js.puter.com/v2/"></script>
</head>
<body>
  <script>
    // Full-stack app ready!
    puter.ai.chat('Hello world!').then(response => {
      console.log(response.message.content)
    })
  </script>
</body>
</html>
```

**Lovable Cloud Alternative:**
- Account setup and verification
- API key configuration
- Environment setup
- Deployment configuration
- Multiple service integrations

#### 3. **Superior AI Capabilities**

```javascript
// Puter.js - 500+ AI models free
const models = [
  'gpt-4-turbo',           // OpenAI
  'claude-3.5-sonnet',     // Anthropic
  'gemini-pro',            // Google
  'llama-3.1-70b',         // Meta
  'grok-beta',             // xAI
  'command-r-plus',        // Cohere
  'deepseek-chat',         // DeepSeek
  'moonshot-v1-8k',        // Kimi
  // ... 490+ more models
]

// All free, no API keys needed
for (const model of models) {
  const response = await puter.ai.chat('Explain quantum computing', { model })
  console.log(`${model}: ${response.message.content}`)
}
```

**Lovable Cloud Alternative:**
- Limited model selection
- Pay per API call
- API key management
- Usage quotas and limits

#### 4. **Complete Full-Stack Solution**

```javascript
// Puter.js - Everything in one platform

// 1. Frontend with AI
const response = await puter.ai.chat('Generate a product description')

// 2. File storage
const file = await puter.fs.write('products.json', JSON.stringify(products))

// 3. Database
await puter.kv.set('user_preferences', preferences)

// 4. Authentication
const user = await puter.auth.getUser()

// 5. Serverless functions
const worker = await puter.workers.create('api', 'api-server.js')

// 6. Static hosting
const site = await puter.hosting.create('my-site', 'index.html')

// All integrated, all free!
```

**Lovable Cloud Alternative:**
- Multiple separate services
- Complex integrations
- Higher costs
- More complexity

### Migration Guide: From Lovable Cloud to Puter.js

#### Step 1: Replace AI API Calls

```javascript
// Before (Lovable Cloud)
const response = await fetch('https://api.lovable.cloud/ai/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello' }]
  })
})

// After (Puter.js)
const response = await puter.ai.chat('Hello', { model: 'gpt-4-turbo' })
// No API keys, no configuration, more models!
```

#### Step 2: Replace File Storage

```javascript
// Before (Lovable Cloud)
const formData = new FormData()
formData.append('file', file)
const response = await fetch('https://api.lovable.cloud/storage/upload', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData
})

// After (Puter.js)
const uploadedFile = await puter.fs.write('uploads/document.pdf', file)
// Simpler, free, unlimited storage
```

#### Step 3: Replace Database Operations

```javascript
// Before (Lovable Cloud)
const response = await fetch('https://api.lovable.cloud/db/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})

// After (Puter.js)
await puter.kv.set('user_john', JSON.stringify({ 
  name: 'John', 
  email: 'john@example.com' 
}))
// Built-in, no setup required
```

#### Step 4: Replace Authentication

```javascript
// Before (Lovable Cloud)
// Complex OAuth setup, third-party providers, configuration...

// After (Puter.js)
await puter.auth.signIn()
const user = await puter.auth.getUser()
// Built-in authentication, no configuration
```

### Real-World Migration Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Migrated from Lovable Cloud to Puter.js</title>
  <script src="https://js.puter.com/v2/"></script>
</head>
<body>
  <div id="app">
    <h1>AI-Powered Task Manager</h1>
    <div id="auth-section">
      <button onclick="signIn()">Sign In</button>
    </div>
    <div id="app-section" style="display: none;">
      <input type="text" id="task-input" placeholder="Describe your task...">
      <button onclick="addTask()">Add Task</button>
      <div id="tasks"></div>
      <button onclick="signOut()">Sign Out</button>
    </div>
  </div>

  <script>
    // Initialize app
    async function initApp() {
      if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser()
        showApp(user)
        loadTasks()
      }
    }

    // Authentication
    async function signIn() {
      await puter.auth.signIn()
      const user = await puter.auth.getUser()
      showApp(user)
      loadTasks()
    }

    async function signOut() {
      await puter.auth.signOut()
      showAuth()
    }

    // Task management with AI
    async function addTask() {
      const taskDescription = document.getElementById('task-input').value
      if (!taskDescription) return

      // Use AI to enhance task description
      const enhancedTask = await puter.ai.chat(
        `Enhance this task description with priority, estimated time, and subtasks: "${taskDescription}"`,
        { model: 'gpt-4-turbo' }
      )

      const task = {
        id: Date.now(),
        original: taskDescription,
        enhanced: enhancedTask.message.content,
        created: new Date().toISOString(),
        completed: false
      }

      // Save to database
      const user = await puter.auth.getUser()
      const userTasks = await getUserTasks(user.uid) || []
      userTasks.push(task)
      await puter.kv.set(`tasks_${user.uid}`, JSON.stringify(userTasks))

      // Update UI
      displayTask(task)
      document.getElementById('task-input').value = ''
    }

    // Load user tasks
    async function loadTasks() {
      const user = await puter.auth.getUser()
      const tasks = await getUserTasks(user.uid) || []
      
      const tasksContainer = document.getElementById('tasks')
      tasksContainer.innerHTML = ''
      
      tasks.forEach(displayTask)
    }

    async function getUserTasks(userId) {
      try {
        const tasksData = await puter.kv.get(`tasks_${userId}`)
        return tasksData ? JSON.parse(tasksData) : []
      } catch (error) {
        console.error('Error loading tasks:', error)
        return []
      }
    }

    function displayTask(task) {
      const tasksContainer = document.getElementById('tasks')
      const taskElement = document.createElement('div')
      taskElement.style.cssText = 'border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px;'
      
      taskElement.innerHTML = `
        <h3>${task.original}</h3>
        <div style="background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 10px 0;">
          <strong>AI Enhancement:</strong><br>
          ${task.enhanced}
        </div>
        <small>Created: ${new Date(task.created).toLocaleString()}</small>
      `
      
      tasksContainer.appendChild(taskElement)
    }

    // UI helpers
    function showApp(user) {
      document.getElementById('auth-section').style.display = 'none'
      document.getElementById('app-section').style.display = 'block'
    }

    function showAuth() {
      document.getElementById('auth-section').style.display = 'block'
      document.getElementById('app-section').style.display = 'none'
    }

    // Initialize
    initApp()
  </script>
</body>
</html>
```

### Cost Comparison: 1 Year Usage

**Lovable Cloud:**
- Basic Plan: $20/month × 12 = $240/year
- Pro Plan: $50/month × 12 = $600/year
- Enterprise: $200/month × 12 = $2,400/year
- **Plus usage fees for AI, storage, compute**

**Puter.js:**
- **$0/year - Completely free**
- Unlimited AI usage
- Unlimited file storage
- Unlimited serverless functions
- Unlimited database operations
- Built-in authentication
- Free static hosting

### Developer Experience Comparison

#### Puter.js Advantages:
- ✅ **Single script tag setup**
- ✅ **No API key management**
- ✅ **Integrated ecosystem**
- ✅ **Instant deployment**
- ✅ **No vendor lock-in**
- ✅ **Open source friendly**
- ✅ **Community driven**

#### Lovable Cloud Limitations:
- ❌ **Complex setup process**
- ❌ **Multiple API keys to manage**
- ❌ **Fragmented services**
- ❌ **Deployment complexity**
- ❌ **Vendor lock-in**
- ❌ **Proprietary platform**
- ❌ **Limited community**

### Conclusion: Why Puter.js Wins

Puter.js provides everything Lovable Cloud offers and more, completely free. With 500+ AI models, unlimited storage, built-in authentication, serverless functions, and static hosting - all accessible with a single script tag - Puter.js is the clear choice for modern web development.

**Make the switch today and save thousands while gaining more capabilities!**

```javascript
// Your entire full-stack application in one script tag
<script src="https://js.puter.com/v2/"></script>

// Welcome to the future of web development! 🚀
```