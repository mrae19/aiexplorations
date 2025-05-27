document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imgBefore = document.getElementById('imgBefore');
    const imgAfter = document.getElementById('imgAfter');
    const imgCompContainer = document.querySelector('.img-comp-container');
    const stylePromptTextarea = document.getElementById('stylePrompt');
    const createAIButton = document.getElementById('createButton');
    const uploadLabel = document.querySelector('.upload-label span');
    const uploadInfo = document.querySelector('.upload-info');
    const downloadPresetBtn = document.getElementById('downloadPreset');
    const dropzone = document.getElementById('dropzone');
    const previewSection = document.querySelector('.image-preview-section');
    const chatSection = document.querySelector('.chat-section');
    const removeImageBtn = document.getElementById('removeImage');
    let originalFileName = '';

    // Enhanced presets with keywords and use cases
    const presets = {
        'warm_sunset': {
            filters: 'sepia(0.3) saturate(1.4) contrast(1.1) brightness(1.05) hue-rotate(5deg)',
            description: 'Warm summer sunset with golden tones',
            keywords: ['sunset', 'warm', 'golden', 'summer', 'orange', 'evening', 'glow', 'sun'],
            useCase: 'Perfect for outdoor photos taken during golden hour, landscapes, or portraits with warm lighting'
        },
        'moody_cinematic': {
            filters: 'contrast(1.2) brightness(0.9) saturate(0.8) sepia(0.2)',
            description: 'Dark and moody cinematic look',
            keywords: ['cinematic', 'moody', 'dark', 'film', 'movie', 'dramatic', 'atmospheric', 'brooding'],
            useCase: 'Great for urban photography, dramatic portraits, or creating a film-like atmosphere'
        },
        'vintage_film': {
            filters: 'sepia(0.4) saturate(0.8) contrast(1.2) brightness(1.1) hue-rotate(-10deg)',
            description: 'Classic vintage film look',
            keywords: ['vintage', 'retro', 'old', 'classic', 'nostalgic', 'aged', 'timeless'],
            useCase: 'Ideal for creating a timeless feel, street photography, or adding nostalgic character'
        },
        'cool_morning': {
            filters: 'brightness(1.1) saturate(0.9) contrast(1.1) hue-rotate(180deg)',
            description: 'Cool morning light with blue tones',
            keywords: ['morning', 'cool', 'fresh', 'crisp', 'blue', 'dawn', 'early', 'foggy'],
            useCase: 'Perfect for early morning shots, misty scenes, or creating a fresh, cool atmosphere'
        },
        'sepia_tone': {
            filters: 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(0.7)',
            description: 'Classic warm brown tone that evokes vintage photography',
            keywords: ['sepia', 'brown', 'antique', 'historical', 'old', 'traditional', 'vintage'],
            useCase: 'Best for creating an antique look, historical photos, or traditional portraits'
        },
        'cinematic': {
            filters: 'contrast(1.25) saturate(0.85) brightness(0.95) sepia(0.1)',
            description: 'High contrast with slightly desaturated colors for that Hollywood look',
            keywords: ['cinema', 'film', 'movie', 'hollywood', 'professional', 'dramatic', 'blockbuster'],
            useCase: 'Ideal for dramatic scenes, storytelling images, or professional-looking shots'
        },
        'kodak_film': {
            filters: 'saturate(1.15) contrast(1.1) brightness(1.05) sepia(0.15) hue-rotate(5deg)',
            description: 'Warm tones with enhanced reds and yellows like classic Kodak film',
            keywords: ['kodak', 'film', 'analog', 'warm', 'professional', 'portrait', 'natural'],
            useCase: 'Perfect for portraits, lifestyle photos, or achieving a professional film look'
        },
        'leica_film': {
            filters: 'contrast(1.2) saturate(0.9) brightness(1) sepia(0.1) hue-rotate(-10deg)',
            description: 'High micro-contrast with controlled saturation and Leica-like clarity',
            keywords: ['leica', 'sharp', 'clean', 'crisp', 'professional', 'street', 'clarity'],
            useCase: 'Great for street photography, architectural shots, or high-end documentary style'
        },
        'light_airy': {
            filters: 'brightness(1.15) contrast(0.9) saturate(0.85) sepia(0.1)',
            description: 'Bright, soft look with lifted shadows for a dreamy feel',
            keywords: ['bright', 'airy', 'soft', 'light', 'dreamy', 'romantic', 'ethereal', 'wedding'],
            useCase: 'Perfect for wedding photography, fashion, or creating a romantic atmosphere'
        },
        'dark_moody': {
            filters: 'contrast(1.3) brightness(0.9) saturate(0.8) sepia(0.15)',
            description: 'Deep shadows with rich contrast for a dramatic look',
            keywords: ['dark', 'moody', 'dramatic', 'shadow', 'contrast', 'mysterious', 'intense'],
            useCase: 'Ideal for dramatic portraits, low-key photography, or moody landscapes'
        },
        // NEW INSTAGRAM/VSCO INSPIRED PRESETS
        'vsco_hb1': {
            filters: 'contrast(1.15) brightness(1.08) saturate(0.9) sepia(0.05) hue-rotate(-5deg)',
            description: 'VSCO HB1 inspired - bright and clean with subtle warmth',
            keywords: ['vsco', 'bright', 'clean', 'minimal', 'instagram', 'lifestyle', 'fresh', 'modern'],
            useCase: 'Perfect for lifestyle content, food photography, and bright Instagram feeds'
        },
        'instagram_warm': {
            filters: 'saturate(1.2) contrast(1.1) brightness(1.1) sepia(0.2) hue-rotate(10deg)',
            description: 'Popular Instagram warm filter with enhanced oranges and yellows',
            keywords: ['instagram', 'warm', 'orange', 'yellow', 'influencer', 'lifestyle', 'cozy', 'autumn'],
            useCase: 'Ideal for lifestyle posts, autumn photos, and creating a cohesive warm Instagram feed'
        },
        'teal_orange': {
            filters: 'contrast(1.2) saturate(1.3) brightness(1.05) hue-rotate(15deg) sepia(0.1)',
            description: 'Trendy teal and orange color grading popular on social media',
            keywords: ['teal', 'orange', 'trendy', 'modern', 'cinematic', 'pop', 'vibrant', 'social'],
            useCase: 'Great for modern portraits, urban photography, and trendy social media content'
        },
        'film_grain': {
            filters: 'contrast(1.1) brightness(1.02) saturate(0.95) sepia(0.08) opacity(0.98)',
            description: 'Film aesthetic with subtle grain and muted colors',
            keywords: ['film', 'grain', 'analog', 'muted', 'aesthetic', 'indie', 'artistic', 'texture'],
            useCase: 'Perfect for artistic photography, indie aesthetics, and film-inspired content'
        },
        'pastel_dream': {
            filters: 'brightness(1.2) contrast(0.85) saturate(0.7) sepia(0.15) hue-rotate(-20deg)',
            description: 'Soft pastel tones with dreamy, ethereal quality',
            keywords: ['pastel', 'soft', 'dreamy', 'pink', 'purple', 'kawaii', 'aesthetic', 'gentle'],
            useCase: 'Ideal for fashion photography, beauty content, and soft aesthetic feeds'
        },
        'urban_grit': {
            filters: 'contrast(1.4) brightness(0.95) saturate(0.8) sepia(0.1) hue-rotate(-15deg)',
            description: 'High contrast urban look with desaturated colors',
            keywords: ['urban', 'gritty', 'street', 'contrast', 'edgy', 'city', 'industrial', 'raw'],
            useCase: 'Perfect for street photography, urban exploration, and edgy portrait work'
        },
        'golden_hour': {
            filters: 'saturate(1.3) contrast(1.05) brightness(1.15) sepia(0.25) hue-rotate(20deg)',
            description: 'Enhanced golden hour glow with warm, magical lighting',
            keywords: ['golden', 'hour', 'magic', 'glow', 'sunset', 'warm', 'romantic', 'dreamy'],
            useCase: 'Excellent for portraits during golden hour, romantic scenes, and warm lifestyle content'
        },
        'matte_black': {
            filters: 'contrast(0.9) brightness(1.1) saturate(0.7) sepia(0.05) opacity(0.95)',
            description: 'Trendy matte finish with lifted blacks and reduced contrast',
            keywords: ['matte', 'lifted', 'blacks', 'trendy', 'modern', 'soft', 'instagram', 'fade'],
            useCase: 'Popular for modern Instagram aesthetics, portrait photography, and lifestyle content'
        },
        'neon_nights': {
            filters: 'contrast(1.3) saturate(1.4) brightness(0.9) hue-rotate(270deg) sepia(0.1)',
            description: 'Cyberpunk-inspired with enhanced purples and magentas',
            keywords: ['neon', 'cyberpunk', 'purple', 'magenta', 'night', 'futuristic', 'electric', 'vibrant'],
            useCase: 'Perfect for nightlife photography, neon-lit scenes, and futuristic aesthetics'
        },
        'clean_minimal': {
            filters: 'contrast(1.05) brightness(1.12) saturate(0.85) sepia(0.02)',
            description: 'Clean, minimal look with bright whites and subtle desaturation',
            keywords: ['clean', 'minimal', 'white', 'bright', 'simple', 'modern', 'scandinavian', 'fresh'],
            useCase: 'Ideal for minimalist feeds, product photography, and clean lifestyle content'
        }
    };

    // Define base attributes that we can extract from text
    const moodAttributes = {
        warm: { temperature: 30, tint: 10, saturation: 15, vibrance: 20 },
        cool: { temperature: -30, tint: -10, saturation: -5, vibrance: 10 },
        moody: { contrast: 15, blacks: -15, shadows: -10, clarity: 10 },
        bright: { exposure: 0.5, highlights: 10, whites: 15, brightness: 10 },
        dark: { exposure: -0.5, blacks: -20, shadows: -15, brightness: -10 },
        vintage: { saturation: -10, fade: 20, grain: 20, vignette: 30 },
        film: { contrast: 10, grain: 30, saturation: -5, fade: 15 },
        vibrant: { saturation: 25, vibrance: 35, clarity: 15, contrast: 10 },
        muted: { saturation: -15, contrast: -5, clarity: -10, fade: 10 },
        dramatic: { contrast: 30, clarity: 25, blacks: -25, highlights: -15 },
        soft: { clarity: -15, contrast: -10, sharpness: -20, noise: -10 },
        sharp: { clarity: 25, sharpness: 30, detail: 20, contrast: 15 }
    };

    const timeAttributes = {
        sunset: { temperature: 40, tint: 15, saturation: 20, orangeHue: 30 },
        sunrise: { temperature: 30, tint: 10, saturation: 15, pinkHue: 20 },
        night: { exposure: -0.3, blues: 20, clarity: 15, contrast: 20 },
        morning: { temperature: -10, clarity: 5, exposure: 0.2, blueHue: 10 },
        golden: { temperature: 35, saturation: 25, contrast: 15, yellowHue: 25 }
    };

    const styleAttributes = {
        cinematic: { contrast: 25, saturation: -5, letterbox: true, fade: 10 },
        portrait: { clarity: -10, sharpness: 15, skintones: true, blur: 5 },
        landscape: { clarity: 20, saturation: 15, dehaze: 10, contrast: 15 },
        street: { contrast: 20, clarity: 15, grain: 10, blacks: -15 },
        minimal: { contrast: 5, saturation: -10, clarity: 5, whites: 10 }
    };

    function analyzeText(text) {
        text = text.toLowerCase();
        let attributes = {
            temperature: 0, tint: 0, exposure: 0, contrast: 0,
            highlights: 0, shadows: 0, whites: 0, blacks: 0,
            clarity: 0, dehaze: 0, saturation: 0, vibrance: 0,
            grain: 0, fade: 0, sharpness: 0, vignette: 0
        };

        // Extract intensity modifiers
        const intensityModifiers = {
            'very': 1.5, 'extremely': 2, 'slightly': 0.5,
            'bit': 0.3, 'super': 1.8, 'subtle': 0.4
        };
        let intensityMultiplier = 1;

        // Find intensity modifiers in text
        Object.keys(intensityModifiers).forEach(modifier => {
            if (text.includes(modifier)) {
                intensityMultiplier = intensityModifiers[modifier];
            }
        });

        // Check for moods
        Object.keys(moodAttributes).forEach(mood => {
            if (text.includes(mood)) {
                Object.entries(moodAttributes[mood]).forEach(([key, value]) => {
                    attributes[key] = (attributes[key] || 0) + value * intensityMultiplier;
                });
            }
        });

        // Check for time references
        Object.keys(timeAttributes).forEach(time => {
            if (text.includes(time)) {
                Object.entries(timeAttributes[time]).forEach(([key, value]) => {
                    attributes[key] = (attributes[key] || 0) + value * intensityMultiplier;
                });
            }
        });

        // Check for style references
        Object.keys(styleAttributes).forEach(style => {
            if (text.includes(style)) {
                Object.entries(styleAttributes[style]).forEach(([key, value]) => {
                    if (typeof value === 'number') {
                        attributes[key] = (attributes[key] || 0) + value * intensityMultiplier;
                    }
                });
            }
        });

        return attributes;
    }

    function generateDynamicFilters(attributes) {
        // Convert our analyzed attributes into CSS filters
        let filters = [];

        // Temperature (warm/cool) -> sepia and hue-rotate
        if (attributes.temperature > 0) {
            filters.push(`sepia(${Math.min(attributes.temperature / 100, 0.5)})`);
        } else if (attributes.temperature < 0) {
            filters.push(`hue-rotate(${Math.abs(attributes.temperature)}deg)`);
        }

        // Exposure/Brightness
        const brightness = 1 + (attributes.exposure + attributes.brightness / 100);
        filters.push(`brightness(${brightness})`);

        // Contrast
        const contrast = 1 + (attributes.contrast / 100);
        filters.push(`contrast(${contrast})`);

        // Saturation
        const saturation = 1 + ((attributes.saturation + attributes.vibrance) / 100);
        filters.push(`saturate(${saturation})`);

        // Shadows/Blacks (using opacity and contrast to simulate)
        if (attributes.shadows < 0 || attributes.blacks < 0) {
            filters.push(`opacity(${0.95 + (attributes.shadows + attributes.blacks) / 200})`);
        }

        return filters.join(' ');
    }

    // Dropzone event handlers
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }

    // Setup dropzone events
    if (dropzone) {
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('dragleave', handleDragLeave);
        dropzone.addEventListener('drop', handleDrop);
    }

    // File handling
    function handleFile(file) {
        // Store original filename without extension
        originalFileName = file.name.replace(/\.[^/.]+$/, '');

        // Validate file type
        if (!file.type.match('image.*')) {
            showToast('Please upload an image file', 'error');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            showToast('File size should be less than 10MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            imgBefore.src = e.target.result;
            imgAfter.src = e.target.result;

            // Reset any existing filters
            imgAfter.style.filter = '';
            imgAfter.classList.remove('kodak-film-look');

            // Add image-loaded class to body for layout changes
            document.body.classList.add('image-loaded');

            // Show preview and chat sections with animation
            setTimeout(() => {
                previewSection.style.display = 'block';
                chatSection.style.display = 'block';
                // Trigger reflow
                previewSection.offsetHeight;
                chatSection.offsetHeight;
                // Add visible class
                previewSection.classList.add('visible');
                chatSection.classList.add('visible');
                
                // Smooth scroll to chat section on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        chatSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 500);
                }
            }, 0);

            imgBefore.onload = function() {
                const loadedImgWidth = imgBefore.naturalWidth;
                const loadedImgHeight = imgBefore.naturalHeight;
                
                const cssMaxWidth = 800;
                const cssMaxHeight = 600;

                let displayWidth = loadedImgWidth;
                let displayHeight = loadedImgHeight;

                const aspectRatio = loadedImgWidth / loadedImgHeight;

                if (displayWidth > cssMaxWidth) {
                    displayWidth = cssMaxWidth;
                    displayHeight = displayWidth / aspectRatio;
                }

                if (displayHeight > cssMaxHeight) {
                    displayHeight = cssMaxHeight;
                    displayWidth = displayHeight * aspectRatio;
                }
                
                // On mobile, respect the viewport height constraint
                if (window.innerWidth <= 768) {
                    const maxMobileHeight = window.innerHeight * 0.45; // 45vh
                    if (displayHeight > maxMobileHeight) {
                        displayHeight = maxMobileHeight;
                        displayWidth = displayHeight * aspectRatio;
                    }
                }
                
                imgCompContainer.style.width = displayWidth + 'px';
                imgCompContainer.style.height = displayHeight + 'px';

                imgBefore.style.width = displayWidth + 'px';
                imgBefore.style.height = displayHeight + 'px';
                imgAfter.style.width = displayWidth + 'px';
                imgAfter.style.height = displayHeight + 'px';
                
                initComparisons();
            }
        }
        reader.readAsDataURL(file);
    }

    // File input change handler
    if (imageUpload) {
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                handleFile(file);
            }
        });
    }

    // Remove image handler
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', function() {
            // Reset filename
            originalFileName = '';
            
            // Reset images
            imgBefore.src = '#';
            imgAfter.src = '#';
            
            // Remove image-loaded class from body
            document.body.classList.remove('image-loaded');
            
            // Hide sections with animation
            previewSection.classList.remove('visible');
            chatSection.classList.remove('visible');
            
            // After animation, hide sections
            setTimeout(() => {
                previewSection.style.display = 'none';
                chatSection.style.display = 'none';
            }, 500); // Match the CSS transition duration
            
            // Reset any existing filters
            imgAfter.style.filter = '';
            imgAfter.classList.remove('kodak-film-look');
            
            // Hide download button
            downloadPresetBtn.style.display = 'none';
            
            // Clear the file input
            imageUpload.value = '';
            
            // Clear the style prompt
            stylePromptTextarea.value = '';
            
            // Scroll back to top on mobile
            if (window.innerWidth <= 768) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    function initComparisons() {
        const existingSliders = document.querySelectorAll(".img-comp-container .img-comp-slider");
        existingSliders.forEach(s => s.remove());

        const overlays = document.getElementsByClassName("img-comp-overlay");
        Array.from(overlays).forEach(compareImages);
    }

    function compareImages(imgOverlayDiv) {
        const containerWidth = imgOverlayDiv.parentElement.offsetWidth;
        const containerHeight = imgOverlayDiv.parentElement.offsetHeight;

        // Set initial position
        imgOverlayDiv.style.width = (containerWidth / 2) + "px";
        
        // Create slider
        const slider = document.createElement("DIV");
        slider.setAttribute("class", "img-comp-slider");
        
        imgOverlayDiv.parentElement.insertBefore(slider, imgOverlayDiv);
        
        // Position slider
        positionSlider(slider, imgOverlayDiv);
        
        // Event handling
        let isDragging = false;

        slider.addEventListener("mousedown", startDragging);
        window.addEventListener("mousemove", drag);
        window.addEventListener("mouseup", stopDragging);
        
        slider.addEventListener("touchstart", startDragging, { passive: false });
        window.addEventListener("touchmove", drag, { passive: false });
        window.addEventListener("touchend", stopDragging);

        function startDragging(e) {
            e.preventDefault();
            isDragging = true;
            slider.style.transition = 'none';
            imgOverlayDiv.style.transition = 'none';
        }

        function stopDragging() {
            isDragging = false;
            slider.style.transition = 'transform 0.2s ease';
            imgOverlayDiv.style.transition = 'width 0.2s ease';
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();
            const rect = imgOverlayDiv.parentElement.getBoundingClientRect();
            const x = (e.type === 'touchmove' ? e.touches[0].pageX : e.pageX) - rect.left - window.scrollX;
            
            // Constrain movement
            const pos = Math.max(0, Math.min(x, containerWidth));
            
            // Update positions with smooth transition
            imgOverlayDiv.style.width = pos + "px";
            positionSlider(slider, imgOverlayDiv);
        }
    }

    function positionSlider(slider, imgOverlayDiv) {
        const containerHeight = imgOverlayDiv.parentElement.offsetHeight;
        const overlayWidth = parseFloat(imgOverlayDiv.style.width);
        slider.style.top = (containerHeight / 2) - (slider.offsetHeight / 2) + "px";
        slider.style.left = overlayWidth - (slider.offsetWidth / 2) + "px";
    }

    // XMP Generation functions
    function generateXMPPreset(presetName, settings) {
        const uuid = generateUUID();
        const date = new Date().toISOString();
        
        return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000 1.000000, 0000/00/00-00:00:00        ">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
    crs:PresetType="Normal"
    crs:Cluster=""
    crs:UUID="${uuid}"
    crs:SupportsAmount="False"
    crs:SupportsColor="True"
    crs:SupportsMonochrome="True"
    crs:SupportsHighDynamicRange="True"
    crs:SupportsNormalDynamicRange="True"
    crs:SupportsSceneReferred="True"
    crs:SupportsOutputReferred="True"
    crs:RequiresRGBTables="False"
    crs:CameraModelRestriction=""
    crs:Copyright=""
    crs:ContactInfo=""
    crs:Version="15.0"
    crs:ProcessVersion="11.0"
    crs:Brightness="${settings.brightness}"
    crs:Contrast="${settings.contrast}"
    crs:Saturation="${settings.saturation}"
    crs:Vibrance="${settings.vibrance}"
    crs:Temperature="${settings.temperature}"
    crs:Tint="${settings.tint}"
    crs:Exposure2012="${settings.exposure}"
    crs:Highlights2012="${settings.highlights}"
    crs:Shadows2012="${settings.shadows}"
    crs:Whites2012="${settings.whites}"
    crs:Blacks2012="${settings.blacks}"
    crs:Clarity2012="${settings.clarity}"
    crs:Dehaze="${settings.dehaze}"
    crs:ToneCurveName2012="Linear"
    crs:HasSettings="True">
    <crs:Name>${presetName}</crs:Name>
    <crs:ShortName>${presetName}</crs:ShortName>
    <crs:SortName>${presetName}</crs:SortName>
    <crs:Group>Custom Presets</crs:Group>
    <crs:Description>Generated by Lightroom AI Preset Creator</crs:Description>
    <crs:DateCreated>${date}</crs:DateCreated>
   </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function convertCSSFiltersToLightroomSettings(filters) {
        const filterValues = {};
        filters.split(' ').forEach(filter => {
            const match = filter.match(/([\w-]+)\(([\d.]+)([^)]*)\)/);
            if (match) {
                filterValues[match[1]] = parseFloat(match[2]);
            }
        });

        // Convert to Lightroom settings with more nuanced mapping
        return {
            temperature: Math.round((filterValues.sepia || 0) * 100),
            tint: Math.round((filterValues['hue-rotate'] || 0) / 3),
            exposure: Math.log2(filterValues.brightness || 1),
            contrast: Math.round((filterValues.contrast || 1) * 50 - 50),
            highlights: Math.round((filterValues.brightness || 1) * 20 - 20),
            shadows: Math.round((filterValues.opacity || 1) * 50 - 50),
            whites: Math.round((filterValues.brightness || 1) * 30 - 30),
            blacks: Math.round((filterValues.opacity || 1) * -40 + 40),
            clarity: Math.round((filterValues.contrast || 1) * 30 - 30),
            dehaze: Math.round((filterValues.contrast || 1) * 20 - 20),
            vibrance: Math.round((filterValues.saturate || 1) * 40 - 40),
            saturation: Math.round((filterValues.saturate || 1) * 50 - 50)
        };
    }

    function downloadXMP(xmpContent, filename) {
        const blob = new Blob([xmpContent], { type: 'application/x-xmp' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to find the best matching preset based on user input
    function findBestPreset(userInput) {
        const input = userInput.toLowerCase();
        let bestMatch = {
            preset: null,
            score: 0
        };

        // Check each preset for matching keywords
        Object.entries(presets).forEach(([presetName, preset]) => {
            let score = 0;
            
            // Check keywords
            preset.keywords.forEach(keyword => {
                if (input.includes(keyword.toLowerCase())) {
                    score += 2; // Keywords are worth more points
                }
            });
            
            // Check description and use case for partial matches
            const words = input.split(/\s+/);
            words.forEach(word => {
                if (word.length > 3) { // Only check words longer than 3 characters
                    if (preset.description.toLowerCase().includes(word)) score += 1;
                    if (preset.useCase.toLowerCase().includes(word)) score += 1;
                }
            });

            // Update best match if this preset has a higher score
            if (score > bestMatch.score) {
                bestMatch = {
                    preset: preset,
                    score: score,
                    name: presetName
                };
            }
        });

        return bestMatch.score > 0 ? bestMatch : null;
    }

    // Function to optimize image for logging
    async function optimizeImageForLogging(imgSrc) {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        // Calculate new dimensions (max 800px width/height)
                        let width = img.width;
                        let height = img.height;
                        const maxSize = 800;
                        
                        console.log(`Original image size: ${width}x${height}`);
                        
                        if (width > maxSize || height > maxSize) {
                            if (width > height) {
                                height = Math.round((height * maxSize) / width);
                                width = maxSize;
                            } else {
                                width = Math.round((width * maxSize) / height);
                                height = maxSize;
                            }
                        }

                        console.log(`Optimized image size: ${width}x${height}`);
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            throw new Error('Failed to get canvas context');
                        }
                        
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convert to JPEG with reduced quality
                        const optimizedData = canvas.toDataURL('image/jpeg', 0.7);
                        console.log(`Optimized image data length: ${optimizedData.length}`);
                        
                        resolve(optimizedData);
                    } catch (canvasError) {
                        console.error('Canvas optimization error:', canvasError);
                        reject(new Error(`Canvas optimization failed: ${canvasError.message}`));
                    }
                };
                
                img.onerror = function() {
                    reject(new Error('Failed to load image for optimization'));
                };
                
                img.src = imgSrc;
            } catch (error) {
                console.error('Image optimization setup error:', error);
                reject(new Error(`Image optimization setup failed: ${error.message}`));
            }
        });
    }

    // Function to log user prompts and results
    async function logPromptResult(data) {
        let imageOptimizationError = null;
        
        try {
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFAEM8rGUZwunIn85bObYJ_7h2YwyAs2h_3LqxeVZ_PzIbxEqT0w3JmhV2IYhNktChyw/exec';
            
            console.log('Starting logging process...');
            
            // Add image data to the logging data if an image is loaded
            if (imgBefore && imgBefore.src && imgBefore.src !== '#' && imgBefore.src.startsWith('data:image')) {
                try {
                    console.log('Attempting to optimize image...');
                    data.imageData = await optimizeImageForLogging(imgBefore.src);
                    data.originalFileName = originalFileName;
                    console.log('Image optimization successful');
                } catch (imageError) {
                    console.error('Image optimization failed:', imageError);
                    imageOptimizationError = imageError.message;
                    // Continue without image data
                    data.imageOptimizationError = imageError.message;
                    data.originalFileName = originalFileName;
                }
            }

            console.log('Creating form for submission...');
            
            // Create a form dynamically
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_SCRIPT_URL;
            form.style.display = 'none';

            // Add the data as a hidden input
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'data';
            
            const jsonData = JSON.stringify(data);
            console.log(`JSON data length: ${jsonData.length}`);
            
            input.value = jsonData;
            form.appendChild(input);

            console.log('Creating iframe for submission...');
            
            // Submit in a hidden iframe
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden_logging_frame';
            iframe.style.display = 'none';
            
            // Add error handling for iframe
            iframe.onerror = function() {
                console.error('Iframe submission error');
            };
            
            document.body.appendChild(iframe);
            
            form.target = 'hidden_logging_frame';
            document.body.appendChild(form);
            
            console.log('Submitting form...');
            
            // Submit the form
            form.submit();
            
            console.log('Form submitted successfully');
            
            // Clean up after a delay
            setTimeout(() => {
                try {
                    document.body.removeChild(form);
                    document.body.removeChild(iframe);
                    console.log('Cleanup completed');
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }, 5000);

        } catch (error) {
            console.error('Logging error:', error);
            
            // Try to log the error itself (without image data)
            try {
                const errorData = {
                    prompt: data.prompt || 'Unknown prompt',
                    matchedPreset: '',
                    presetScore: 0,
                    generatedFilters: '',
                    success: false,
                    loggingError: error.message,
                    imageOptimizationError: imageOptimizationError,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                };
                
                console.log('Attempting to log error data...');
                
                const errorForm = document.createElement('form');
                errorForm.method = 'POST';
                errorForm.action = GOOGLE_SCRIPT_URL;
                errorForm.style.display = 'none';

                const errorInput = document.createElement('input');
                errorInput.type = 'hidden';
                errorInput.name = 'data';
                errorInput.value = JSON.stringify(errorData);
                errorForm.appendChild(errorInput);

                const errorIframe = document.createElement('iframe');
                errorIframe.name = 'error_logging_frame';
                errorIframe.style.display = 'none';
                document.body.appendChild(errorIframe);
                
                errorForm.target = 'error_logging_frame';
                document.body.appendChild(errorForm);
                errorForm.submit();
                
                setTimeout(() => {
                    try {
                        document.body.removeChild(errorForm);
                        document.body.removeChild(errorIframe);
                    } catch (e) {
                        console.error('Error cleanup failed:', e);
                    }
                }, 3000);
                
            } catch (errorLoggingError) {
                console.error('Failed to log error:', errorLoggingError);
            }
        }
    }

    // Update the createAIButton click handler
    if (createAIButton && stylePromptTextarea && imgBefore && imgAfter) {
        createAIButton.addEventListener('click', async function() {
            const promptText = stylePromptTextarea.value.trim();
            const originalImageSrc = imgBefore.src;

            if (!promptText) {
                showToast('Please describe the look you want to create.', 'error');
                return;
            }

            if (originalImageSrc === "#" || !originalImageSrc.startsWith('data:image')) {
                showToast('Please upload an image first.', 'error');
                return;
            }

            // Add processing state
            createAIButton.classList.add('processing');
            createAIButton.textContent = 'Processing...';

            // Create and add processing overlay
            const overlay = document.createElement('div');
            overlay.className = 'processing-overlay';
            const processingText = document.createElement('div');
            processingText.className = 'processing-text';
            processingText.textContent = 'Analyzing and applying style...';
            overlay.appendChild(processingText);
            previewSection.appendChild(overlay);

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 4000));

            try {
                // Try to find a matching preset first
                const bestMatch = findBestPreset(promptText);
                
                if (bestMatch && bestMatch.score >= 2) {
                    // Use the matched preset
                    imgAfter.style.filter = bestMatch.preset.filters;
                    
                    // Set up preset download
                    const settings = convertCSSFiltersToLightroomSettings(bestMatch.preset.filters);
                    settings.description = bestMatch.preset.description;
                    const xmpContent = generateXMPPreset(bestMatch.name, settings);
                    downloadPresetBtn.onclick = () => {
                        const filename = originalFileName ? 
                            originalFileName.replace(/\.[^/.]+$/, "") + " - " + bestMatch.name + ".xmp" : 
                            bestMatch.name + ".xmp";
                        downloadXMP(xmpContent, filename);
                    };
                    
                    // Log the successful preset match
                    await logPromptResult({
                        prompt: promptText,
                        matchedPreset: bestMatch.name,
                        presetScore: bestMatch.score,
                        generatedFilters: bestMatch.preset.filters,
                        success: true
                    });
                    
                    showToast(`Applied ${bestMatch.name.replace(/_/g, ' ')} style!`, 'success');
                } else {
                    // Fall back to dynamic generation
                    const attributes = analyzeText(promptText);
                    const filters = generateDynamicFilters(attributes);
                    imgAfter.style.filter = filters;

                    // Generate and enable download of XMP preset
                    const presetName = `AI Generated - ${promptText.slice(0, 30)}`;
                    const xmpContent = generateXMPPreset(presetName, attributes);
                    downloadPresetBtn.onclick = () => {
                        const filename = originalFileName ? 
                            originalFileName.replace(/\.[^/.]+$/, "") + " - preset.xmp" : 
                            "preset.xmp";
                        downloadXMP(xmpContent, filename);
                    };
                    
                    // Log the dynamic generation
                    await logPromptResult({
                        prompt: promptText,
                        matchedPreset: '',
                        presetScore: 0,
                        generatedFilters: filters,
                        success: true
                    });
                    
                    showToast('Created a custom look based on your description!', 'success');
                }
            } catch (error) {
                console.error('Error processing style:', error);
                showToast('Error creating style. Please try again.', 'error');
                
                // Log the error
                await logPromptResult({
                    prompt: promptText,
                    matchedPreset: '',
                    presetScore: 0,
                    generatedFilters: '',
                    success: false
                });
            } finally {
                // Remove processing state
                createAIButton.classList.remove('processing');
                createAIButton.textContent = 'Create with AI';
                overlay.remove();

                // Show download button
                downloadPresetBtn.style.display = 'block';
            }
        });
    }

    // Enhanced toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger reflow
        toast.offsetHeight;

        // Add visible class for animation
        toast.classList.add('visible');

        // Remove after animation
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}); 