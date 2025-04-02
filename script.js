document.getElementById("GenerateBtn").addEventListener("click", async function () {
    let token = "your_huggingface_api_key"; // Add your own API key here
    let input = document.getElementById("textInput").value.trim(); 
    let imageContainer = document.getElementById("imageContainer");

    if (!input) {
        imageContainer.innerHTML = `<p class="text-red-500">Please enter a prompt!</p>`;
        return;
    }
    async function generateImage(data) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ inputs: data }), 
                }
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            return await response.blob(); 
        } catch (error) {
            console.error("Error generating image:", error);
            return null;
        }
    }

    try {
        let imageBlob = await generateImage(input); 

        if (!imageBlob) {
            imageContainer.innerHTML = `<p class="text-red-500">Failed to generate image. Please try again later.</p>`;
            return;
        }

        let imageUrl = URL.createObjectURL(imageBlob); 
        imageContainer.innerHTML = `<img src="${imageUrl}" class="mx-auto rounded-lg shadow-lg" />`; 

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = "Download Image";
        downloadBtn.classList.add('w-full', 'bg-blue-500', 'rounded-lg', 'px-6', "mt-4", 'py-2', 'text-white');

        downloadBtn.addEventListener("click", function () {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'generated-image.png';
            link.click();
        });

        imageContainer.appendChild(downloadBtn);

    } catch (error) {
        console.error("Error:", error);
        imageContainer.innerHTML = `<p class="text-red-500">Something went wrong. Try again.</p>`;
    }
});
