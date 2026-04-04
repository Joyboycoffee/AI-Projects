import os
import tempfile
from typing import Dict, Any
from jinja2 import Template
from weasyprint import HTML, CSS
from app.schemas import ResumeContent


class PDFService:
    """Service for generating PDF resumes from resume data."""

    # HTML templates for different resume styles
    TEMPLATES = {
        "modern": """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { margin: 0.5in; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.4;
                    color: #333;
                    background: white;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .header h1 { font-size: 32px; margin-bottom: 10px; }
                .header .contact {
                    font-size: 12px;
                    opacity: 0.9;
                }
                .content { padding: 30px; }
                .section { margin-bottom: 25px; }
                .section-title {
                    font-size: 18px;
                    color: #667eea;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .item { margin-bottom: 15px; }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .company { color: #666; font-style: italic; }
                .description { font-size: 13px; color: #444; margin-top: 5px; }
                .skills-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .skill-tag {
                    background: #f0f0f0;
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                }
                .summary {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{{ personal_info.full_name }}</h1>
                <div class="contact">
                    {{ personal_info.email }} | {{ personal_info.phone }}
                    {% if personal_info.linkedin %} | {{ personal_info.linkedin }}{% endif %}
                    {% if personal_info.website %} | {{ personal_info.website }}{% endif %}
                </div>
            </div>

            <div class="content">
                {% if personal_info.summary %}
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="summary">{{ personal_info.summary }}</div>
                </div>
                {% endif %}

                {% if experience %}
                <div class="section">
                    <div class="section-title">Experience</div>
                    {% for exp in experience %}
                    <div class="item">
                        <div class="item-header">
                            <span>{{ exp.position }}</span>
                            <span>{{ exp.start_date }} - {{ exp.end_date or 'Present' }}</span>
                        </div>
                        <div class="company">{{ exp.company }}</div>
                        <div class="description">{{ exp.description }}</div>
                    </div>
                    {% endfor %}
                </div>
                {% endif %}

                {% if education %}
                <div class="section">
                    <div class="section-title">Education</div>
                    {% for edu in education %}
                    <div class="item">
                        <div class="item-header">
                            <span>{{ edu.degree }}{% if edu.field %} in {{ edu.field }}{% endif %}</span>
                            <span>{{ edu.start_date }} - {{ edu.end_date or 'Present' }}</span>
                        </div>
                        <div class="company">{{ edu.school }}</div>
                        {% if edu.description %}
                        <div class="description">{{ edu.description }}</div>
                        {% endif %}
                    </div>
                    {% endfor %}
                </div>
                {% endif %}

                {% if skills %}
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="skills-grid">
                        {% for skill in skills %}
                        <span class="skill-tag">{{ skill.name }}{% if skill.level %} ({{ skill.level }}){% endif %}</span>
                        {% endfor %}
                    </div>
                </div>
                {% endif %}

                {% if projects %}
                <div class="section">
                    <div class="section-title">Projects</div>
                    {% for proj in projects %}
                    <div class="item">
                        <div class="item-header">{{ proj.name }}</div>
                        <div class="description">{{ proj.description }}</div>
                        {% if proj.technologies %}
                        <div class="skills-grid" style="margin-top: 5px;">
                            {% for tech in proj.technologies %}
                            <span class="skill-tag">{{ tech }}</span>
                            {% endfor %}
                        </div>
                        {% endif %}
                    </div>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
        </body>
        </html>
        """,

        "minimal": """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { margin: 0.6in; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: Georgia, serif;
                    line-height: 1.5;
                    color: #222;
                }
                .header {
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .header h1 { font-size: 28px; margin-bottom: 8px; }
                .header .contact {
                    font-size: 12px;
                    color: #666;
                }
                .section { margin-bottom: 20px; }
                .section-title {
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                    color: #000;
                }
                .item { margin-bottom: 12px; }
                .item-title { font-weight: bold; }
                .item-subtitle { color: #666; font-size: 13px; }
                .item-date { float: right; color: #666; font-size: 12px; }
                .description { font-size: 13px; margin-top: 4px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{{ personal_info.full_name }}</h1>
                <div class="contact">
                    {{ personal_info.email }} | {{ personal_info.phone }}
                </div>
            </div>

            {% if personal_info.summary %}
            <div class="section">
                <div class="section-title">Summary</div>
                <div class="description">{{ personal_info.summary }}</div>
            </div>
            {% endif %}

            {% if experience %}
            <div class="section">
                <div class="section-title">Experience</div>
                {% for exp in experience %}
                <div class="item">
                    <div>
                        <span class="item-title">{{ exp.position }}</span>
                        <span class="item-date">{{ exp.start_date }} - {{ exp.end_date or 'Present' }}</span>
                    </div>
                    <div class="item-subtitle">{{ exp.company }}</div>
                    <div class="description">{{ exp.description }}</div>
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if education %}
            <div class="section">
                <div class="section-title">Education</div>
                {% for edu in education %}
                <div class="item">
                    <div>
                        <span class="item-title">{{ edu.school }}</span>
                        <span class="item-date">{{ edu.start_date }} - {{ edu.end_date or 'Present' }}</span>
                    </div>
                    <div class="item-subtitle">{{ edu.degree }}{% if edu.field %}, {{ edu.field }}{% endif %}</div>
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if skills %}
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="description">
                    {{ skills | map(attribute='name') | join(', ') }}
                </div>
            </div>
            {% endif %}
        </body>
        </html>
        """,

        "professional": """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { margin: 0.75in; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.4;
                    color: #000;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 { font-size: 24px; margin-bottom: 5px; }
                .header .contact { font-size: 11px; }
                .section { margin-bottom: 18px; }
                .section-title {
                    font-size: 12px;
                    font-weight: bold;
                    border-bottom: 1px solid #000;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }
                .item { margin-bottom: 10px; }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }
                .company { font-style: italic; }
                .description { font-size: 11px; margin-top: 3px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{{ personal_info.full_name }}</h1>
                <div class="contact">
                    {{ personal_info.email }} | {{ personal_info.phone }}
                </div>
            </div>

            {% if experience %}
            <div class="section">
                <div class="section-title">Professional Experience</div>
                {% for exp in experience %}
                <div class="item">
                    <div class="item-header">
                        <span>{{ exp.company }}</span>
                        <span>{{ exp.start_date }} - {{ exp.end_date or 'Present' }}</span>
                    </div>
                    <div class="company">{{ exp.position }}</div>
                    <div class="description">{{ exp.description }}</div>
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if education %}
            <div class="section">
                <div class="section-title">Education</div>
                {% for edu in education %}
                <div class="item">
                    <div class="item-header">
                        <span>{{ edu.school }}</span>
                        <span>{{ edu.start_date }} - {{ edu.end_date or 'Present' }}</span>
                    </div>
                    <div class="company">{{ edu.degree }}{% if edu.field %}, {{ edu.field }}{% endif %}</div>
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if skills %}
            <div class="section">
                <div class="section-title">Skills</div>
                <div class="description">
                    {% for skill in skills %}{{ skill.name }}{% if not loop.last %}, {% endif %}{% endfor %}
                </div>
            </div>
            {% endif %}
        </body>
        </html>
        """
    }

    def generate_pdf(self, content: Dict[str, Any], template: str = "modern") -> bytes:
        """Generate a PDF from resume content."""

        # Get template HTML
        template_html = self.TEMPLATES.get(template, self.TEMPLATES["modern"])

        # Create Jinja2 template
        jinja_template = Template(template_html)

        # Prepare data for template
        resume_data = {
            "personal_info": content.get("personal_info", {}),
            "education": content.get("education", []),
            "experience": content.get("experience", []),
            "skills": content.get("skills", []),
            "projects": content.get("projects", []),
        }

        # Render HTML
        html_content = jinja_template.render(**resume_data)

        # Convert to PDF
        html_doc = HTML(string=html_content)
        pdf = html_doc.write_pdf()

        return pdf


# Singleton instance
pdf_service = PDFService()
