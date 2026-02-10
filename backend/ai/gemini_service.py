import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")

def generate_resume_content(role, skills, experience):
    prompt = f"""
    You are a professional resume writer.

    Generate a concise, ATS-friendly resume summary.

    Job Role: {role}
    Skills: {skills}
    Experience: {experience}

    Keep it professional and impactful.
    """

    response = model.generate_content(prompt)
    return response.text
