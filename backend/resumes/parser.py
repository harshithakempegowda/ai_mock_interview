import re

COMMON_SKILLS = [
    'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'django',
    'flask', 'node.js', 'nodejs', 'express', 'sql', 'mysql', 'postgresql', 'sqlite',
    'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'html', 'css',
    'tailwind', 'bootstrap', 'redux', 'rest api', 'graphql', 'machine learning',
    'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'c++', 'c#', 'go',
    'rust', 'php', 'ruby', 'linux', 'agile', 'scrum', 'communication', 'leadership',
]


def extract_text_from_pdf(file_path):
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(file_path)
        text = ''
        for page in reader.pages:
            text += page.extract_text() or ''
        return text
    except Exception:
        return ''


def parse_resume_text(text):
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    name = lines[0] if lines else ''

    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ''

    phone_match = re.search(r'(\+?\d[\d \-\(\)]{8,15}\d)', text)
    phone = phone_match.group(0) if phone_match else ''

    text_lower = text.lower()
    found_skills = sorted(set(skill for skill in COMMON_SKILLS if skill in text_lower))

    education = ''
    edu_keywords = ['education', 'b.tech', 'bachelor', 'master', 'university', 'college', 'degree']
    edu_lines = []
    capture = False
    for line in lines:
        low = line.lower()
        if any(k in low for k in ['education']):
            capture = True
            continue
        if capture and any(k in low for k in ['experience', 'projects', 'skills', 'certifications']):
            capture = False
        if capture:
            edu_lines.append(line)
        elif any(k in low for k in ['university', 'college', 'b.tech', 'bachelor', 'master', 'degree']):
            edu_lines.append(line)
    education = '\n'.join(edu_lines[:8])

    projects = ''
    proj_lines = []
    capture = False
    for line in lines:
        low = line.lower()
        if low.startswith('projects') or low == 'projects':
            capture = True
            continue
        if capture and any(k in low for k in ['experience', 'education', 'skills', 'certifications']):
            capture = False
        if capture:
            proj_lines.append(line)
    projects = '\n'.join(proj_lines[:15])

    score = 40
    if email:
        score += 10
    if phone:
        score += 10
    if found_skills:
        score += min(len(found_skills) * 3, 30)
    if education:
        score += 5
    if projects:
        score += 5
    score = min(score, 100)

    suggestions = []
    if not email:
        suggestions.append('Add a professional email address.')
    if not phone:
        suggestions.append('Include a contact phone number.')
    if len(found_skills) < 5:
        suggestions.append('List more relevant technical skills.')
    if not projects:
        suggestions.append('Add a projects section showcasing your work.')
    if not education:
        suggestions.append('Add an education section with degree details.')
    if not suggestions:
        suggestions.append('Resume looks well-structured. Consider tailoring it per job description.')

    return {
        'name': name,
        'email': email,
        'phone': phone,
        'skills': ', '.join(found_skills),
        'education': education,
        'projects': projects,
        'score': score,
        'suggestions': ' '.join(suggestions),
    }
