import { frameworks, url, initSurvey, getSurveyResult, getQuestionJson, getDynamicPanelRemoveButton, getListItemByText, completeButton } from "../helper";
import { Selector } from "testcafe";
const title = "paneldynamic";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Please enter all blood relatives you know",
          renderMode: "progressTop",
          defaultValue: [
            {
              relativeType: "father",
            },
            {
              relativeType: "mother",
            },
          ],
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              name: "relativeType",
              type: "dropdown",
              title: "Relative",
              choices: [
                "father",
                "mother",
                "brother",
                "sister",
                "son",
                "daughter",
              ],
              isRequired: true,
            },
            {
              name: "isalive",
              type: "radiogroup",
              title: "Alive?",
              startWithNewLine: false,
              isRequired: true,
              colCount: 0,
              choices: ["Yes", "No"],
            },
            {
              name: "liveage",
              type: "dropdown",
              title: "Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'Yes'",
              choicesMin: 1,
              choicesMax: 115,
            },
            {
              name: "deceasedage",
              type: "dropdown",
              title: "Deceased Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: [
                {
                  value: -1,
                  text: "Unknown",
                },
              ],
              choicesMin: 1,
              choicesMax: 115,
            },
            {
              name: "causeofdeathknown",
              type: "radiogroup",
              title: "Cause of Death Known?",
              isRequired: true,
              colCount: 0,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: ["Yes", "No"],
            },
            {
              name: "causeofdeath",
              type: "text",
              title: "Cause of Death",
              isRequired: true,
              startWithNewLine: false,
              visibleIf:
                "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'",
            },
            {
              type: "panel",
              name: "moreInfo",
              state: "expanded",
              title: "Detail Information about: {panel.relativeType}",
              elements: [
                {
                  type: "matrixdynamic",
                  name: "relativeillness",
                  title: "Describe the illness or condition.",
                  rowCount: 0,
                  columns: [
                    {
                      name: "illness",
                      cellType: "dropdown",
                      title: "Illness/Condition",
                      choices: [
                        "Cancer",
                        "Heart Disease",
                        "Diabetes",
                        "Stroke/TIA",
                        "High Blood Pressure",
                        "High Cholesterol or Triglycerides",
                        "Liver Disease",
                        "Alcohol or Drug Abuse",
                        "Anxiety, Depression or Psychiatric Illness",
                        "Tuberculosis",
                        "Anesthesia Complications",
                        "Genetic Disorder",
                        "Other – describe",
                      ],
                      isRequired: true,
                    },
                    {
                      name: "description",
                      cellType: "text",
                      title: "Describe",
                      isRequired: true,
                    },
                  ],
                },
              ],
            },
          ],
          panelAddText: "Add a blood relative",
          panelRemoveText: "Remove the relative",
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("fill panel dynamic and add new panel", async (t) => {
    const relativeTypeDropdown = Selector("div[data-name='relativeType'] .sv_q_dropdown_control");
    const ageDropdown = Selector("div[data-name='liveage'] .sv_q_dropdown_control");
    const deceasedAgeDropdown = Selector("div[data-name='deceasedage'] .sv_q_dropdown_control");
    const relativeillnessDropdown = Selector("div[data-name='relativeillness'] .sv_q_dropdown_control");

    const addRowSelector = Selector("button").find("span").withText("Add Row");

    await t.click("input[value=\"Yes\"]")

      .click(ageDropdown)
      .click(getListItemByText("72"))
      .expect(ageDropdown.find(".sv-string-viewer").textContent).eql("72")

      .click(".sv-paneldynamic__next-btn")
      .click("input[value=\"Yes\"]")

      .click(ageDropdown)
      .click(getListItemByText("65"))
      .expect(ageDropdown.find(".sv-string-viewer").textContent).eql("65")

      .click(Selector(".sv-paneldynamic__add-btn").withText("Add a blood relative"))

      .click(relativeTypeDropdown)
      .click(getListItemByText("sister"))
      .expect(relativeTypeDropdown.find(".sv-string-viewer").textContent).eql("sister")
      .click("input[value=\"No\"]")

      .click(deceasedAgeDropdown)
      .click(getListItemByText("42"))
      .expect(deceasedAgeDropdown.find(".sv-string-viewer").textContent).eql("42")
      .click("div[data-name='causeofdeathknown'] input[value=\"No\"]")
      .click(".sv-paneldynamic__prev-btn")
      .click(".sv-paneldynamic__prev-btn")

      .click(addRowSelector)

      .click(relativeillnessDropdown)
      .click(getListItemByText("Diabetes"))
      .expect(relativeillnessDropdown.find(".sv-string-viewer").textContent).eql("Diabetes")
      .typeText("td[title=\"Describe\"] input[type=\"text\"]", "Type 2")

      .click(".sv-paneldynamic__next-btn")
      .click(getDynamicPanelRemoveButton("Please enter all blood relatives you know", "Remove the relative"))

      .click(completeButton);

    await t.expect(await getSurveyResult()).eql({
      relatives: [
        {
          relativeType: "father",
          isalive: "Yes",
          liveage: 72,
          relativeillness: [
            {
              illness: "Diabetes",
              description: "Type 2",
            },
          ],
        },
        {
          relativeType: "sister",
          isalive: "No",
          causeofdeathknown: "No",
          deceasedage: 42
        },
      ],
    });
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on panel title state editable", async (t) => {
    const newTitle = "MyText";
    const outerSelector = ".sv_p_title";
    const innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    const json = JSON.parse(await getQuestionJson());
    await t.expect(json.title).eql(newTitle);
  });
});
