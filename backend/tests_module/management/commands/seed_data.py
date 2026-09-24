from django.core.management.base import BaseCommand
from tests_module.models import TestCategory, Question
from interviews.models import InterviewQuestionBank


APTITUDE = [
    ("If a train travels 60 km in 1.5 hours, what is its speed?", "30 km/h", "40 km/h", "45 km/h", "50 km/h", "b"),
    ("What is 15% of 200?", "20", "25", "30", "35", "c"),
    ("Find the next number: 2, 4, 8, 16, ?", "20", "24", "32", "36", "c"),
    ("If A=1, B=2... what is the value of 'CAT'?", "24", "26", "28", "30", "a"),
    ("A shop sells an item at 20% profit. If cost price is 500, selling price is?", "550", "580", "600", "620", "c"),
]

TECHNICAL = [
    ("Which data structure uses FIFO order?", "Stack", "Queue", "Tree", "Graph", "b"),
    ("What does HTTP stand for?", "HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyperlink Text Protocol", "None", "a"),
    ("Which of these is a NoSQL database?", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "c"),
    ("What is the time complexity of binary search?", "O(n)", "O(log n)", "O(n^2)", "O(1)", "b"),
    ("Which language is primarily used for styling web pages?", "HTML", "CSS", "JS", "Python", "b"),
]

HR = [
    ("What motivates you to perform well at work?", "Money", "Growth & learning", "Fear", "Nothing", "b"),
    ("How do you handle workplace conflict?", "Avoid it", "Discuss & resolve calmly", "Escalate immediately", "Ignore it", "b"),
    ("What is most important in a team?", "Hierarchy", "Communication", "Competition", "Isolation", "b"),
    ("How do you prioritize tasks?", "Randomly", "By urgency & importance", "By personal preference", "Last-minute", "b"),
    ("Why should we hire you?", "No reason", "Relevant skills & passion", "Need a job", "Friend works here", "b"),
]

CODING = [
    ("Which keyword is used to define a function in Python?", "func", "def", "function", "lambda", "b"),
    ("What does API stand for?", "Application Programming Interface", "Applied Program Interaction", "App Process Integration", "None", "a"),
    ("Which is a valid way to create an array in JS?", "let a = []", "let a = {}", "let a = ()", "let a = <>", "a"),
    ("What does SQL 'JOIN' do?", "Deletes rows", "Combines rows from tables", "Creates a table", "Sorts data", "b"),
    ("Which sorting algorithm has best average time complexity O(n log n)?", "Bubble sort", "Merge sort", "Selection sort", "Insertion sort", "b"),
]


class Command(BaseCommand):
    help = 'Seed sample test questions and interview question banks.'

    def handle(self, *args, **options):
        mapping = {'aptitude': APTITUDE, 'technical': TECHNICAL, 'hr': HR, 'coding': CODING}
        for cat_name, questions in mapping.items():
            cat, _ = TestCategory.objects.get_or_create(name=cat_name)
            if Question.objects.filter(category=cat).exists():
                continue
            for text, a, b, c, d, correct in questions:
                Question.objects.create(
                    category=cat, text=text, option_a=a, option_b=b, option_c=c, option_d=d,
                    correct_option=correct
                )
        self.stdout.write(self.style.SUCCESS('Test questions seeded.'))

        interview_questions = {
            'technical': [
                "Explain the difference between SQL and NoSQL databases.",
                "What is the time complexity of binary search?",
                "Describe REST API principles.",
                "What is the difference between synchronous and asynchronous programming?",
                "How does garbage collection work in most programming languages?",
                "What is the difference between a process and a thread?",
            ],
            'hr': [
                "Tell me about yourself.",
                "Why do you want to work with us?",
                "Describe a time you handled conflict at work.",
                "What are your greatest strengths and weaknesses?",
                "Where do you see yourself in 5 years?",
            ],
            'behavioral': [
                "Describe a challenging project and how you overcame obstacles.",
                "Tell me about a time you failed and what you learned.",
                "How do you handle tight deadlines?",
                "Describe a time you worked in a team to achieve a goal.",
            ],
            'coding': [
                "Explain how you would reverse a linked list.",
                "How would you find duplicate elements in an array efficiently?",
                "Explain the concept of recursion with an example.",
                "How do you optimize a slow database query?",
            ],
        }
        for itype, qs in interview_questions.items():
            if InterviewQuestionBank.objects.filter(interview_type=itype).exists():
                continue
            for q in qs:
                InterviewQuestionBank.objects.create(interview_type=itype, text=q)
        self.stdout.write(self.style.SUCCESS('Interview questions seeded.'))
