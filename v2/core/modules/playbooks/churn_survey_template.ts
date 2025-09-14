import template from "./churn_survey_template.json";

export const ChurnSurveyTemplate = {
  id: "churn_survey_template",
  function: "churn survey template",
  dependencies: [],
  gardener_role: "grower",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: ["churn", "survey", "template"],
  apply() {
    return template;
  },
  fallback() {
    return {};
  },
  negotiate() {},
  evolve() {},
  coevolve() {},
  cultivate() {},
};

export default {};
