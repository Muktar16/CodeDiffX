
# import re

# def calculate_cyclomatic_complexity(code):
#     complexity = 2  # Initialize with 2 for the default path

#     # Count if, elseif, else, for, while, do-while, switch cases
#     complexity += len(re.findall(r'\b(if|elseif|for|while|do\s*while|case)\s*\(', code))

#     # Count ternary operators (?:)
#     complexity += len(re.findall(r'\?', code))

#     return complexity

# # php_code = """
# #     function foo() {
# #     if ($a > 10) {
# #         echo 1;
# #     } else {
# #         echo 2;
# #     }

# #     if ($a > $b) {
# #         echo 3;
# #     } else {
# #         echo 4;
# #     }
# # }
# # """

# php_code = """
# class Foo {
#  public function example() {
#      if ($a == $b) {
#            if ($a1 == $b1) {
#                 fiddle();
#            } 
#            elseif ($a2 == $b2) {
#                 fiddle();
#             } else {
#                 fiddle();
#             }
#        } 
#        elseif ($c == $d) {
#            while ($c == $d) {
#                 fiddle();
#             }
#         } 
#         elseif ($e == $f) {
#            for ($n = 0; $n < $h; $n++) {
#                 fiddle();
#             }
#         } else {
#             switch ($z) {
#                case 1:
#                     fiddle();
#                     break;
#               case 2:
#                     fiddle();
#                     break;
#               case 3:
#                     fiddle();
#                     break;
#                 default:
#                     fiddle();
#                     break;
#             }
#         }
#     }
# }
# """

# complexity = calculate_cyclomatic_complexity(php_code)
# print(f"Cyclomatic Complexity: {complexity}")



def calculate_cyclomatic_complexity(code):
    decision_points = ['if', 'while', 'for', 'case']
    count = 0

    for point in decision_points:
        count += code.count(point)

    return count + 2

php_code = """
<?php
if ($condition1) {
    // ...
} elseif ($condition2) {
    // ...
} else {
    // ...
}

for ($i = 0; $i < 10; $i++) {
    // ...
}

while ($condition3) {
    // ...
}

switch ($value) {
    case 1:
        // ...
        break;
    case 2:
        // ...
        break;
    default:
        // ...
        break;
}
?>
"""

complexity = calculate_cyclomatic_complexity(php_code)

if complexity <= 4:
    complexity_category = "low complexity"
elif complexity <= 7:
    complexity_category = "moderate complexity"
elif complexity <= 10:
    complexity_category = "high complexity"
else:
    complexity_category = "very high complexity"

print(f"Cyclomatic Complexity: {complexity}")
print(f"Complexity Category: {complexity_category}")
