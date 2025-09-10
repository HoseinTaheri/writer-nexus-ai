import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, provider = 'gapgpt', model = 'gpt-4o', language = 'fa' } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'موضوع مقاله الزامی است' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let generatedContent = '';
    let title = '';
    let excerpt = '';

    if (provider === 'gapgpt') {
      const gapgptApiKey = Deno.env.get('GAPGPT_API_KEY');
      if (!gapgptApiKey) {
        return new Response(
          JSON.stringify({ error: 'کلید API گپ جی‌پی‌تی تنظیم نشده است' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const systemPrompt = language === 'fa' 
        ? `شما یک نویسنده حرفه‌ای مقاله هستید. یک مقاله کامل و جامع در موضوع داده شده بنویسید. مقاله باید شامل موارد زیر باشد:
1. عنوان جذاب و خلاقانه
2. خلاصه کوتاه (150-200 کلمه)  
3. محتوای اصلی مقاله (حداقل 1500 کلمه)
4. استفاده از سرفصل‌ها و زیرعنوان‌ها
5. استفاده از فرمت مارک‌داون
6. محتوا باید علمی، دقیق و قابل اعتماد باشد
7. زبان باید رسمی و ادبی باشد

لطفاً پاسخ را در قالب JSON با کلیدهای title, excerpt, content ارائه دهید.`
        : `You are a professional article writer. Write a complete and comprehensive article on the given topic. The article should include:
1. An attractive and creative title
2. Brief summary (150-200 words)
3. Main article content (minimum 1500 words)
4. Use of headings and subheadings
5. Use of markdown format
6. Content should be scientific, accurate and reliable
7. Language should be formal and literary

Please provide the response in JSON format with keys: title, excerpt, content.`;

      const response = await fetch('https://api.gapgpt.app/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gapgptApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`GapGPT API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        title = parsed.title;
        excerpt = parsed.excerpt;
        generatedContent = parsed.content;
      } catch {
        // If not JSON, parse manually
        const lines = content.split('\n');
        title = lines.find(line => line.includes('عنوان') || line.includes('title'))?.replace(/.*:/, '').trim() || prompt;
        excerpt = content.substring(0, 300) + '...';
        generatedContent = content;
      }

    } else if (provider === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        return new Response(
          JSON.stringify({ error: 'کلید API جمینی تنظیم نشده است' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const systemPrompt = language === 'fa' 
        ? `شما یک نویسنده حرفه‌ای مقاله هستید. یک مقاله کامل و جامع در موضوع "${prompt}" بنویسید. مقاله باید شامل عنوان جذاب، خلاصه کوتاه و محتوای اصلی باشد. از فرمت مارک‌داون استفاده کنید.`
        : `You are a professional article writer. Write a complete and comprehensive article on the topic "${prompt}". The article should include an attractive title, brief summary, and main content. Use markdown format.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      generatedContent = data.candidates[0].content.parts[0].text;
      
      // Extract title and excerpt from content
      const lines = generatedContent.split('\n');
      title = lines.find(line => line.startsWith('#'))?.replace('#', '').trim() || prompt;
      excerpt = generatedContent.substring(0, 300) + '...';
    }

    return new Response(
      JSON.stringify({
        title: title || prompt,
        excerpt: excerpt || generatedContent.substring(0, 300) + '...',
        content: generatedContent,
        provider: provider,
        model: model
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI article generator:', error);
    return new Response(
      JSON.stringify({ 
        error: 'خطا در تولید مقاله با هوش مصنوعی',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});