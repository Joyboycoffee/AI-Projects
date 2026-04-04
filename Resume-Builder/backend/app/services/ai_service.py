import os
from typing import Dict, Any, Optional
from app.config import get_settings

settings = get_settings()


class AIService:
    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        self.client = None

        # Initialize Anthropic client if API key is available
        if self.api_key:
            try:
                from anthropic import Anthropic
                self.client = Anthropic(api_key=self.api_key)
            except ImportError:
                print("Warning: anthropic package not installed")
            except Exception as e:
                print(f"Warning: Could not initialize Anthropic client: {e}")

    async def optimize_resume_section(self, section: str, content: str) -> Dict[str, Any]:
        """
        Optimize a resume section using Claude API.
        If API key is not available, returns simulated response.
        """
        if not self.client:
            # Return simulated response for demo/testing
            return self._simulate_optimization(section, content)

        try:
            prompts = {
                "summary": """You are an expert resume writer. Rewrite this professional summary to be more impactful,
                ATS-friendly, and compelling. Use strong action verbs and highlight key achievements.
                Keep it concise (3-5 sentences).

                Original: {content}

                Optimized version:""",

                "experience": """You are an expert resume writer. Rewrite these work experience bullet points to be more
                impactful, quantifiable, and ATS-friendly. Use the STAR method (Situation, Task, Action, Result) and
                include metrics where possible. Make each bullet point start with a strong action verb.

                Original: {content}

                Optimized version:""",

                "skills": """You are an expert resume writer. Optimize this skills section for ATS compatibility.
                Categorize skills into Technical, Soft Skills, and Tools. Ensure they match industry keywords.

                Original: {content}

                Optimized version:""",

                "education": """You are an expert resume writer. Rewrite this education section to be concise and professional.
                Highlight relevant coursework or achievements if provided.

                Original: {content}

                Optimized version:""",

                "projects": """You are an expert resume writer. Rewrite these project descriptions to be more impactful.
                Highlight technologies used, your role, and quantifiable outcomes. Use strong action verbs.

                Original: {content}

                Optimized version:""",
            }

            prompt = prompts.get(section, prompts["summary"]).format(content=content)

            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )

            optimized_content = response.content[0].text.strip()

            return {
                "success": True,
                "original": content,
                "optimized": optimized_content,
                "section": section,
                "ai_generated": True
            }

        except Exception as e:
            # Fall back to simulation on error
            print(f"AI optimization error: {e}")
            return self._simulate_optimization(section, content)

    def _simulate_optimization(self, section: str, content: str) -> Dict[str, Any]:
        """Simulate AI optimization for demo purposes."""

        simulations = {
            "summary": f"Results-driven professional with extensive experience in delivering high-quality solutions. "
                      f"Proven track record of leveraging technical expertise and strategic thinking to drive business growth. "
                      f"Skilled in cross-functional collaboration, project management, and continuous improvement. "
                      f"Passionate about creating innovative solutions that exceed expectations and deliver measurable results.",

            "experience": f"• Led cross-functional team of 8 members to deliver $2.5M project 20% under budget\n"
                         f"• Increased system efficiency by 35% through implementation of automated workflows\n"
                         f"• Negotiated vendor contracts resulting in $500K annual cost savings\n"
                         f"• Mentored 5 junior developers, improving team productivity by 25%\n"
                         f"• Architected scalable solution serving 100K+ daily active users",

            "skills": "Technical: Python, JavaScript, React, Node.js, SQL, AWS, Docker\n"
                     "Soft Skills: Leadership, Communication, Problem-solving, Team Collaboration\n"
                     "Tools: Git, Jira, Figma, Tableau, MongoDB, PostgreSQL",

            "education": "Bachelor of Science in Computer Science\n"
                        "University of Technology | Graduated 2020\n"
                        "GPA: 3.8/4.0 | Dean's List | Relevant Coursework: Machine Learning, Data Structures",

            "projects": f"• Built full-stack web application using React and Node.js, serving 10K+ users\n"
                       f"• Implemented CI/CD pipeline reducing deployment time by 60%\n"
                       f"• Optimized database queries improving application performance by 40%",
        }

        optimized = simulations.get(section, content)

        return {
            "success": True,
            "original": content,
            "optimized": optimized,
            "section": section,
            "ai_generated": False,
            "note": "This is a simulated response. Add ANTHROPIC_API_KEY to your .env file for real AI optimization."
        }

    async def suggest_ats_keywords(self, job_title: str) -> Dict[str, Any]:
        """Suggest ATS keywords based on job title."""

        keywords_by_role = {
            "software engineer": [
                "Python", "JavaScript", "React", "Node.js", "API Development",
                "CI/CD", "Agile", "Test-Driven Development", "Microservices"
            ],
            "data scientist": [
                "Machine Learning", "Python", "R", "SQL", "TensorFlow",
                "Data Analysis", "Statistical Modeling", "Tableau", "Big Data"
            ],
            "product manager": [
                "Product Strategy", "Agile", "User Research", "A/B Testing",
                "Roadmapping", "Stakeholder Management", "Data-Driven", "OKRs"
            ],
            "ux designer": [
                "User Research", "Figma", "Prototyping", "Design Systems",
                "Usability Testing", "Interaction Design", "Accessibility", "Wireframing"
            ],
        }

        keywords = keywords_by_role.get(job_title.lower(), [
            "Communication", "Leadership", "Problem Solving",
            "Project Management", "Team Collaboration", "Strategic Thinking"
        ])

        return {
            "success": True,
            "job_title": job_title,
            "keywords": keywords,
            "ai_generated": not bool(self.client)
        }


# Singleton instance
ai_service = AIService()
