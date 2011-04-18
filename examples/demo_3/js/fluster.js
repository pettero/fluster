﻿var fluster = {"steps": {"step_1": {"mustache": "<h2>Step 1.</h2><form action=\"\" method=\"\"><label for=\"step1\">Add your name</label><input type=\"text\" id=\"step1\" name=\"step1_name\"/></form><p><a href=\"#step2\">Proceed to step2</a></p>", "selectors": {"a[href='#step2']": {"click": "function(event){\n\t$(event.data.parent).data(\"first_name\", $(\"#step1\").val());\n\t$(event.currentTarget).trigger(\"step_2\");\n\tevent.preventDefault();\n}"}}}, "step_3": {"data": "function(resp, element){\n\tvar resp = {};\n\tresp.name = $(element).data(\"first_name\") + \" \" + $(element).data(\"last_name\");\n\treturn resp;\n}", "mustache": "<h3>Hi {{name}}!</h2>"}, "step_2": {"mustache": "<h2>Step 2.</h2><form action=\"\" method=\"\"><label for=\"step2\">Add your last name</label><input type=\"text\" id=\"step2\" name=\"step2_name\"/></form><p><a href=\"#step3\">Proceed to step3</a></p>", "selectors": {"a[href='#step3']": {"click": "function(event){\n\t$(event.data.parent).data(\"last_name\", $(\"#step2\").val());\n\t$(event.currentTarget).trigger(\"step_3\");\n\tevent.preventDefault();\n}"}}}, "_init": {"before": "function(element, event){\n\t$(element).trigger(\"step_1\");\n}"}}};