import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print("Gemini client error:", e)


def fallback_ai_content(job_title):

    return {
        "summary": f"Motivated and detail-oriented {job_title} with strong analytical, technical, and communication skills. Able to work effectively in team environments and deliver high-quality results.",
        "skills": [
            "Communication",
            "Problem Solving",
            "Teamwork",
            "Technical Skills",
            "Time Management"
        ],
        "experience": f"Worked on academic and personal projects related to {job_title}. Demonstrated ability to learn quickly and apply knowledge effectively."
    }


def generate_ai_content(job_title):

    if client:
        try:

            prompt = f"Generate a professional resume summary for a {job_title}."

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )

            if response and response.text:

                return {
                    "summary": response.text,
                    "skills": [
                        "Communication",
                        "Problem Solving",
                        "Teamwork"
                    ],
                    "experience": response.text
                }

        except Exception as e:

            print("Gemini failed:", e)

    # ALWAYS RETURN FALLBACK
    return fallback_ai_content(job_title)
