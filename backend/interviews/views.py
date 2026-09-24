import random

from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import (
    Interview,
    InterviewResponse,
    InterviewQuestionBank,
)
from .serializers import InterviewSerializer


# ============================================================
# CONFIGURATION
# ============================================================

# Number of questions asked in each interview.
#
# Example:
# 10 = 10 questions per interview
# 15 = 15 questions per interview
# 20 = 20 questions per interview
#
# You only need to change this one value.
QUESTIONS_PER_INTERVIEW = 10


# ============================================================
# FALLBACK QUESTIONS
# ============================================================
#
# These are used ONLY when the database does not contain
# questions for the selected interview type.
#
# Your main questions should come from InterviewQuestionBank.
#
# ============================================================

DEFAULT_QUESTIONS = {

    # --------------------------------------------------------
    # TECHNICAL
    # --------------------------------------------------------

    "technical": [

        "Explain the difference between SQL and NoSQL databases.",

        "What is the time complexity of binary search?",

        "Describe REST API principles.",

        "What is the difference between synchronous and asynchronous programming?",

        "How does garbage collection work in programming languages?",

        "What is object-oriented programming?",

        "Explain the four pillars of object-oriented programming.",

        "What is the difference between a process and a thread?",

        "What is normalization in DBMS?",

        "Explain primary key and foreign key.",

        "What is an API?",

        "What is the difference between GET and POST requests?",

        "Explain database indexing.",

        "What is the difference between HTTP and HTTPS?",

        "What is version control and why is Git used?",

        "What is the difference between frontend and backend development?",

        "What is cloud computing?",

        "What is the difference between authentication and authorization?",

        "Explain client-server architecture.",

        "What is a database transaction?",
    ],


    # --------------------------------------------------------
    # HR
    # --------------------------------------------------------

    "hr": [

        "Tell me about yourself.",

        "Why do you want to work with us?",

        "Describe a time you handled conflict at work.",

        "What are your greatest strengths and weaknesses?",

        "Where do you see yourself in 5 years?",

        "Why should we hire you?",

        "What motivates you?",

        "What are your career goals?",

        "Tell me about your educational background.",

        "What do you know about our company?",

        "Why did you choose your field of study?",

        "What is your greatest achievement?",

        "How do you handle pressure?",

        "Are you comfortable working in a team?",

        "Are you willing to relocate?",

        "How do you prioritize your work?",

        "What are your salary expectations?",

        "What makes you different from other candidates?",

        "How do you handle criticism?",

        "Do you have any questions for us?",
    ],


    # --------------------------------------------------------
    # BEHAVIORAL
    # --------------------------------------------------------

    "behavioral": [

        "Describe a challenging project and how you overcame obstacles.",

        "Tell me about a time you failed and what you learned.",

        "How do you handle tight deadlines?",

        "Describe a time you worked in a team to achieve a goal.",

        "Tell me about a time you demonstrated leadership.",

        "Describe a situation where you had to solve a difficult problem.",

        "Tell me about a disagreement you had with a team member.",

        "Describe a time when you had multiple tasks to complete.",

        "Tell me about a time you took initiative.",

        "Describe a situation where you had to adapt to change.",

        "Tell me about a time you received constructive criticism.",

        "Describe a time when you helped a team member.",

        "Tell me about a difficult decision you had to make.",

        "Describe a situation where you made a mistake.",

        "Tell me about a time you worked under pressure.",

        "Describe a situation where communication was important.",

        "Tell me about a time you had to learn something quickly.",

        "Describe a goal you set and how you achieved it.",

        "Tell me about a time you managed a conflict.",

        "Describe a situation where teamwork helped you succeed.",
    ],


    # --------------------------------------------------------
    # CODING
    # --------------------------------------------------------

    "coding": [

        "Explain how you would reverse a linked list.",

        "How would you find duplicate elements in an array efficiently?",

        "Explain recursion with an example.",

        "How do you optimize a slow database query?",

        "How would you reverse a string?",

        "How would you check whether a string is a palindrome?",

        "How would you find the largest element in an array?",

        "How would you find the second largest element in an array?",

        "Explain binary search and when you would use it.",

        "How would you remove duplicates from a list?",

        "How would you count the frequency of elements in an array?",

        "How would you find a missing number in an array?",

        "How would you check whether two strings are anagrams?",

        "Explain the difference between a stack and a queue.",

        "How would you implement a stack?",

        "How would you find the factorial of a number?",

        "How would you generate the Fibonacci sequence?",

        "How would you sort an array?",

        "How would you merge two sorted arrays?",

        "How would you find duplicate characters in a string?",
    ],


    # --------------------------------------------------------
    # APTITUDE
    # --------------------------------------------------------

    "aptitude": [

        "If a number is increased by 20% and then decreased by 20%, what is the overall percentage change?",

        "A train travels 120 km in 2 hours. What is its average speed?",

        "What is the average of 10, 20, 30, 40 and 50?",

        "If 5 workers complete a task in 12 days, how many days will 10 workers take?",

        "A product costs Rs. 800 and is sold for Rs. 960. What is the profit percentage?",

        "Find the next number in the sequence: 2, 4, 8, 16, ?",

        "If x + 5 = 15, what is the value of x?",

        "What is 25% of 240?",

        "A person walks 5 km north and then 3 km south. How far is the person from the starting point?",

        "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls are there?",

        "What is the simple interest on Rs. 5000 at 10% per year for 2 years?",

        "If 3 pens cost Rs. 45, what is the cost of 8 pens?",

        "Find the LCM of 12 and 18.",

        "Find the HCF of 24 and 36.",

        "What is the probability of getting a head when a fair coin is tossed once?",

        "If a car travels at 60 km/h, how far will it travel in 3 hours?",

        "What is the percentage increase from 50 to 75?",

        "A shop gives a 10% discount on an item priced at Rs. 1000. What is the selling price?",

        "Find the next number: 5, 10, 15, 20, ?",

        "If 8 machines produce 800 units in a day, how many units will 12 machines produce at the same rate?",
    ],
}


# ============================================================
# START INTERVIEW
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_interview(request):

    # Get interview type from frontend.
    interview_type = request.data.get(
        "interview_type",
        "technical",
    )

    # Make sure it is a string.
    if not isinstance(interview_type, str):
        return Response(
            {
                "detail": "Invalid interview_type."
            },
            status=400,
        )

    # Remove spaces and convert to lowercase.
    interview_type = interview_type.strip().lower()

    # --------------------------------------------------------
    # Supported interview types
    # --------------------------------------------------------

    valid_types = {
        "technical",
        "hr",
        "behavioral",
        "coding",
        "aptitude",
    }

    if interview_type not in valid_types:

        return Response(
            {
                "detail": (
                    f"Invalid interview type: "
                    f"{interview_type}. "
                    f"Supported types are: "
                    f"{', '.join(sorted(valid_types))}"
                )
            },
            status=400,
        )

    # --------------------------------------------------------
    # Create interview
    # --------------------------------------------------------

    interview = Interview.objects.create(
        user=request.user,
        interview_type=interview_type,
    )

    # --------------------------------------------------------
    # Get questions from database
    # --------------------------------------------------------

    bank_questions = list(
        InterviewQuestionBank.objects.filter(
            interview_type=interview_type
        )
    )

    # ========================================================
    # DATABASE QUESTIONS
    # ========================================================

    if bank_questions:

        # If database has:
        #
        # 100 questions
        # and QUESTIONS_PER_INTERVIEW = 10
        #
        # randomly select 10.
        #
        # If database has only 5:
        # select those 5.
        #
        number_to_select = min(
            QUESTIONS_PER_INTERVIEW,
            len(bank_questions),
        )

        selected_questions = random.sample(
            bank_questions,
            number_to_select,
        )

        # Create InterviewResponse for every selected question.

        for index, question in enumerate(
            selected_questions,
            start=1,
        ):

            InterviewResponse.objects.create(
                interview=interview,
                question_text=question.question_text,
                order=index,
            )

    # ========================================================
    # FALLBACK QUESTIONS
    # ========================================================

    else:

        # Database does not contain questions
        # for this interview type.

        questions = list(
            DEFAULT_QUESTIONS.get(
                interview_type,
                DEFAULT_QUESTIONS["technical"],
            )
        )

        number_to_select = min(
            QUESTIONS_PER_INTERVIEW,
            len(questions),
        )

        selected_questions = random.sample(
            questions,
            number_to_select,
        )

        for index, question in enumerate(
            selected_questions,
            start=1,
        ):

            InterviewResponse.objects.create(
                interview=interview,
                question_text=question,
                order=index,
            )

    # --------------------------------------------------------
    # Return created interview
    # --------------------------------------------------------

    interview.refresh_from_db()

    return Response(
        InterviewSerializer(interview).data,
        status=201,
    )


# ============================================================
# SUBMIT RESPONSE
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_response(request, interview_id):

    try:

        interview = Interview.objects.get(
            id=interview_id,
            user=request.user,
        )

    except Interview.DoesNotExist:

        return Response(
            {
                "detail": "Interview not found."
            },
            status=404,
        )

    # --------------------------------------------------------
    # Get request data
    # --------------------------------------------------------

    response_id = request.data.get(
        "response_id"
    )

    answer_text = request.data.get(
        "answer_text",
        "",
    )

    duration = request.data.get(
        "duration_seconds",
        0,
    )

    # --------------------------------------------------------
    # Validate response ID
    # --------------------------------------------------------

    if not response_id:

        return Response(
            {
                "detail": "response_id is required."
            },
            status=400,
        )

    # --------------------------------------------------------
    # Find interview response
    # --------------------------------------------------------

    try:

        response = interview.responses.get(
            id=response_id
        )

    except InterviewResponse.DoesNotExist:

        return Response(
            {
                "detail": "Response not found."
            },
            status=404,
        )

    # --------------------------------------------------------
    # Save answer
    # --------------------------------------------------------

    response.answer_text = answer_text
    response.answer_duration_seconds = duration

    response.save(
        update_fields=[
            "answer_text",
            "answer_duration_seconds",
        ]
    )

    return Response(
        InterviewSerializer(
            interview
        ).data
    )


# ============================================================
# GENERATE FEEDBACK
# ============================================================

def generate_feedback(interview):

    responses = list(
        interview.responses.all()
    )

    # --------------------------------------------------------
    # Find answered questions
    # --------------------------------------------------------

    answered = [
        response
        for response in responses
        if response.answer_text
        and response.answer_text.strip()
    ]

    # --------------------------------------------------------
    # Answer ratio
    # --------------------------------------------------------

    if responses:

        answer_ratio = (
            len(answered)
            / len(responses)
        )

    else:

        answer_ratio = 0

    # --------------------------------------------------------
    # Average words per answer
    # --------------------------------------------------------

    if answered:

        total_words = sum(
            len(
                response.answer_text.split()
            )
            for response in answered
        )

        avg_words = (
            total_words
            / len(answered)
        )

    else:

        avg_words = 0

    # --------------------------------------------------------
    # Communication score
    # --------------------------------------------------------

    communication = min(
        100,
        max(
            20,
            avg_words * 2
            + random.randint(0, 10),
        ),
    )

    # --------------------------------------------------------
    # Technical score
    # --------------------------------------------------------

    technical = min(
        100,
        max(
            20,
            answer_ratio * 80
            + random.randint(0, 15),
        ),
    )

    # --------------------------------------------------------
    # Confidence score
    # --------------------------------------------------------

    confidence = min(
        100,
        max(
            20,
            (
                communication
                + technical
            )
            / 2
            + random.randint(-5, 10),
        ),
    )

    # --------------------------------------------------------
    # Overall score
    # --------------------------------------------------------

    overall = round(
        (
            communication
            + technical
            + confidence
        )
        / 3,
        2,
    )

    strengths = []
    weaknesses = []
    suggestions = []

    # ========================================================
    # COMMUNICATION
    # ========================================================

    if communication >= 60:

        strengths.append(
            "Clear and articulate communication."
        )

    else:

        weaknesses.append(
            "Communication could be improved."
        )

        suggestions.append(
            "Practice structured answers using the STAR method."
        )

    # ========================================================
    # TECHNICAL
    # ========================================================

    if technical >= 60:

        strengths.append(
            "Strong technical understanding."
        )

    else:

        weaknesses.append(
            "Technical depth could improve."
        )

        suggestions.append(
            "Revise important concepts before interviews."
        )

    # ========================================================
    # ANSWER COMPLETION
    # ========================================================

    if answer_ratio < 1:

        weaknesses.append(
            "Not all questions were answered."
        )

        suggestions.append(
            "Try to attempt every interview question."
        )

    else:

        strengths.append(
            "Answered all interview questions."
        )

    # ========================================================
    # RETURN FEEDBACK
    # ========================================================

    return {

        "communication_score":
            round(
                communication,
                2,
            ),

        "technical_score":
            round(
                technical,
                2,
            ),

        "confidence_score":
            round(
                confidence,
                2,
            ),

        "overall_score":
            overall,

        "strengths":
            " ".join(strengths),

        "weaknesses":
            " ".join(weaknesses),

        "suggestions":
            " ".join(suggestions),

        "feedback":
            f"Overall Score: {overall}/100",
    }


# ============================================================
# COMPLETE INTERVIEW
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_interview(
    request,
    interview_id,
):

    try:

        interview = Interview.objects.get(
            id=interview_id,
            user=request.user,
        )

    except Interview.DoesNotExist:

        return Response(
            {
                "detail": "Interview not found."
            },
            status=404,
        )

    # --------------------------------------------------------
    # Save duration
    # --------------------------------------------------------

    interview.duration_seconds = request.data.get(
        "duration_seconds",
        interview.duration_seconds,
    )

    # --------------------------------------------------------
    # Generate feedback
    # --------------------------------------------------------

    feedback = generate_feedback(
        interview
    )

    # --------------------------------------------------------
    # Save feedback
    # --------------------------------------------------------

    for key, value in feedback.items():

        setattr(
            interview,
            key,
            value,
        )

    # --------------------------------------------------------
    # Mark interview completed
    # --------------------------------------------------------

    interview.status = "completed"

    interview.completed_at = (
        timezone.now()
    )

    interview.save()

    return Response(
        InterviewSerializer(
            interview
        ).data
    )


# ============================================================
# GET ALL USER INTERVIEWS
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_interviews(request):

    interviews = (
        Interview.objects
        .filter(
            user=request.user
        )
        .order_by(
            "-started_at"
        )
    )

    serializer = InterviewSerializer(
        interviews,
        many=True,
    )

    return Response(
        serializer.data
    )


# ============================================================
# GET SINGLE INTERVIEW
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def interview_detail(
    request,
    interview_id,
):

    try:

        interview = Interview.objects.get(
            id=interview_id,
            user=request.user,
        )

    except Interview.DoesNotExist:

        return Response(
            {
                "detail": "Interview not found."
            },
            status=404,
        )

    return Response(
        InterviewSerializer(
            interview
        ).data
    )