import os
import django
import openpyxl

# ============================================================
# DJANGO SETUP
# ============================================================

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

django.setup()

from interviews.models import InterviewQuestionBank


# ============================================================
# EXCEL FILE
# ============================================================

EXCEL_FILE = "real_interview_questions_100.xlsx"


# ============================================================
# LOAD EXCEL FILE
# ============================================================

print("\n========================================")
print("   AI MOCK INTERVIEW QUESTION IMPORT")
print("========================================\n")

print(f"Loading Excel file: {EXCEL_FILE}")

wb = openpyxl.load_workbook(
    EXCEL_FILE,
    data_only=True
)

sheet = wb.active


# ============================================================
# COUNTERS
# ============================================================

imported = 0
skipped = 0
errors = 0


# ============================================================
# READ QUESTIONS
# ============================================================

for row_number, row in enumerate(
    sheet.iter_rows(
        min_row=2,
        values_only=True
    ),
    start=2
):

    try:

        (
            interview_type,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            difficulty,
            category,
            explanation,
        ) = row

        # ----------------------------------------------------
        # Check required fields
        # ----------------------------------------------------

        if not interview_type:
            print(
                f"Row {row_number}: "
                f"Missing interview type - skipped"
            )

            skipped += 1
            continue

        if not question_text:
            print(
                f"Row {row_number}: "
                f"Missing question text - skipped"
            )

            skipped += 1
            continue

        # ----------------------------------------------------
        # Clean text
        # ----------------------------------------------------

        interview_type = str(
            interview_type
        ).strip().lower()

        question_text = str(
            question_text
        ).strip()

        # ----------------------------------------------------
        # Check duplicate
        # ----------------------------------------------------

        duplicate = (
            InterviewQuestionBank.objects.filter(
                interview_type=interview_type,
                question_text=question_text
            ).exists()
        )

        if duplicate:

            print(
                f"SKIPPED DUPLICATE: "
                f"{question_text[:70]}"
            )

            skipped += 1
            continue

        # ----------------------------------------------------
        # Insert question
        # ----------------------------------------------------

        InterviewQuestionBank.objects.create(

            interview_type=interview_type,

            question_text=question_text,

            option_a=option_a,

            option_b=option_b,

            option_c=option_c,

            option_d=option_d,

            correct_option=correct_option,

            difficulty=difficulty,

            category=category,

            explanation=explanation,
        )

        imported += 1

        print(
            f"IMPORTED: "
            f"[{interview_type}] "
            f"{question_text[:70]}"
        )

    except Exception as error:

        errors += 1

        print(
            f"ERROR in row {row_number}: "
            f"{error}"
        )


# ============================================================
# FINAL SUMMARY
# ============================================================

total_questions = (
    InterviewQuestionBank.objects.count()
)

print("\n========================================")
print("           IMPORT COMPLETE")
print("========================================")

print(
    f"New questions imported : {imported}"
)

print(
    f"Duplicate questions    : {skipped}"
)

print(
    f"Errors                 : {errors}"
)

print(
    f"Total database records : "
    f"{total_questions}"
)

print("========================================")
print()