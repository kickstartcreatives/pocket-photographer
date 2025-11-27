import { createClient } from '@supabase/supabase-js';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addExamplePrompts() {
  const examplePrompts = [
    {
      title: "Golden Hour Portrait",
      description: "Dreamy outdoor portrait with warm, natural lighting",
      full_prompt: "portrait of a woman, shot at f/1.4, golden hour, shallow depth of field, bokeh background, 85mm lens, soft light, creamy bokeh",
      ai_platform: "Midjourney v6",
      terms_used: ["f/1.4", "golden hour", "shallow depth of field", "bokeh", "85mm lens", "soft light"],
      category: "Golden Hour",
      what_to_expect: "Warm, dreamy portrait with beautifully blurred background and professional look. The golden hour lighting creates a natural glow."
    },
    {
      title: "Cinematic Street Photography",
      description: "Moody urban scene with film-like quality",
      full_prompt: "street photography, shot at f/2.8, blue hour, Kodak Portra 400, natural light, environmental portrait, 35mm lens, slight grain",
      ai_platform: "Midjourney v6",
      terms_used: ["f/2.8", "blue hour", "Kodak Portra 400", "35mm lens", "natural light", "environmental portrait"],
      category: "Cinematic",
      what_to_expect: "Moody, cinematic street scene with rich colors and film-like grain. Perfect for urban storytelling with a vintage aesthetic."
    },
    {
      title: "Sharp Landscape",
      description: "Crystal clear landscape with everything in focus",
      full_prompt: "landscape photography, shot at f/8, sharp throughout, deep depth of field, wide angle lens, bright light, maximum detail, vivid colors",
      ai_platform: "DALL-E 3",
      terms_used: ["f/8", "sharp throughout", "deep depth of field", "wide angle lens", "bright light"],
      category: "Landscape",
      what_to_expect: "Crisp, clear landscape with every detail in focus from foreground to background. Ideal for scenic photography with rich colors."
    }
  ];

  console.log(`Adding ${examplePrompts.length} example prompts...`);

  for (const prompt of examplePrompts) {
    const { data, error } = await supabase
      .from('prompt_library')
      .insert([prompt])
      .select();

    if (error) {
      console.error(`Error adding prompt "${prompt.title}":`, error);
    } else {
      console.log(`✓ Added: ${prompt.title}`);
    }
  }

  console.log('\nDone! Check your Prompt Library page.');
}

addExamplePrompts();
