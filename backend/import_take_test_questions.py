import os
import django
import openpyxl

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from tests_module.models import TestCategory, Question

EXCEL_FILE = "take_test_questions.xlsx"

print("\n========================================")
print("     TAKE TEST QUESTION IMPORTER")
print("========================================\n")

try:
    workbook = openpyxl.load_workbook(EXCEL_FILE, data_only=True)
except FileNotFoundError:
    print(f"ERROR: {EXCEL_FILE} was not found.")
    print("Put the Excel file inside the backend folder.")
    exit()

print("Excel loaded successfully.")

# Create categories
category_names = {
    "aptitude": "Aptitude",
    "behavioral": "Behavioral",
    "hr": "HR",
    "coding": "Coding",
}

categories = {}

for name, description in category_names.items():
    category, created = TestCategory.objects.get_or_create(
        name=name,
        defaults={"description": description}
    )

    categories[name] = category

    if created:
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")

imported = 0
skipped = 0
errors = 0

print("\n========================================")
print("        IMPORTING QUESTIONS")
print("========================================\n")

for sheet in workbook.worksheets:

    if sheet.max_row <= 1:
        print(f"Skipping empty sheet: {sheet.title}")
        continue

    print(f"\nProcessing sheet: {sheet.title}")

    headers = [
        str(cell.value).strip().lower()
        if cell.value is not None else ""
        for cell in sheet[1]
    ]

    header_map = {
        header: index
        for index, header in enumerate(headers)
        if header
    }

    required_columns = [
        "category",
        "text",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_option",
        "difficulty",
        "topic",
        "explanation",
    ]

    missing = [
        column
        for column in required_columns
        if column not in header_map
    ]

    if missing:
        print(f"Missing columns: {missing}")
        errors += 1
        continue

    for row_number, row in enumerate(
        sheet.iter_rows(min_row=2, values_only=True),
        start=2
    ):

        try:
            category_value = row[header_map["category"]]
            text_value = row[header_map["text"]]

            if not category_value or not text_value:
                skipped += 1
                continue

            category_name = str(
                category_value
            ).strip().lower()

            question_text = str(
                text_value
            ).strip()

            if category_name not in categories:
                print(
                    f"Row {row_number}: "
                    f"Unknown category '{category_name}'"
                )
                skipped += 1
                continue

            category = categories[category_name]

            # Prevent duplicate questions
            if Question.objects.filter(
                category=category,
                text=question_text
            ).exists():

                print(
                    f"SKIPPED duplicate: "
                    f"{question_text[:60]}"
                )

                skipped += 1
                continue

            def clean_value(column):
                value = row[header_map[column]]
                return str(value).strip() if value is not None else ""

            option_a = clean_value("option_a")
            option_b = clean_value("option_b")
            option_c = clean_value("option_c")
            option_d = clean_value("option_d")

            correct_option = clean_value(
                "correct_option"
            ).lower()

            difficulty = clean_value(
                "difficulty"
            ).lower()

            topic = clean_value("topic")
            explanation = clean_value("explanation")

            if correct_option not in ["a", "b", "c", "d"]:
                print(
                    f"Row {row_number}: "
                    f"Invalid correct option "
                    f"'{correct_option}'"
                )
                skipped += 1
                continue

            if difficulty not in ["easy", "medium", "hard"]:
                difficulty = "medium"

            Question.objects.create(
                category=category,
                text=question_text,
                option_a=option_a,
                option_b=option_b,
                option_c=option_c,
                option_d=option_d,
                correct_option=correct_option,
                explanation=explanation,
                topic=topic,
                is_coding=(category_name == "coding"),
                difficulty=difficulty,
            )

            imported += 1

            print(
                f"IMPORTED: "
                f"{category_name.upper()} - "
                f"{question_text[:60]}"
            )

        except Exception as error:
            errors += 1
            print(
                f"ERROR row {row_number}: {error}"
            )

print("\n========================================")
print("          IMPORT COMPLETE")
print("========================================")

print(f"New questions imported : {imported}")
print(f"Duplicates skipped     : {skipped}")
print(f"Errors                 : {errors}")

print("\nQuestions by category:")

for category in TestCategory.objects.all():
    print(
        f"  {category.name:<12} : "
        f"{category.questions.count()}"
    )

print("\nTotal questions:")
print(Question.objects.count())

print("========================================")