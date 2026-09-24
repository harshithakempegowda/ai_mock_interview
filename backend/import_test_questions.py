import os
import django
import openpyxl

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

django.setup()

from tests_module.models import Question, TestCategory

# Load Excel file
wb = openpyxl.load_workbook(
    "unique_hr_behavioral_coding_105_questions.xlsx"
)

sheet = wb.active

imported = 0
skipped = 0

for row_num, row in enumerate(
    sheet.iter_rows(min_row=2, values_only=True),
    start=2
):
    try:
        # Skip completely empty rows
        if not row or row[0] is None:
            skipped += 1
            continue

        (
            category_name,
            text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            difficulty,
            topic,
            explanation,
        ) = row

        # Create category if it does not exist
        category, _ = TestCategory.objects.get_or_create(
            name=category_name.strip().lower(),
            defaults={
                "description": f"{category_name.title()} Questions"
            }
        )

        # Create question
        Question.objects.create(
            category=category,
            text=text or "",
            option_a=option_a or "",
            option_b=option_b or "",
            option_c=option_c or "",
            option_d=option_d or "",
            correct_option=(correct_option or "").lower(),
            difficulty=difficulty or "medium",
            topic=topic or "",
            explanation=explanation or "",
        )

        imported += 1

    except Exception as e:
        skipped += 1
        print(
            f"Skipping Excel row {row_num} because of error:"
        )
        print(e)

print()
print(f"Successfully imported: {imported} questions")
print(f"Skipped rows: {skipped}")
print("Import completed successfully.")