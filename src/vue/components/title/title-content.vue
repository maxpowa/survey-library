<template>
  <div class="sv-vue-title-additional-div">
    <survey-string v-if="element.isTitleRenderedAsString" :locString="element.locTitle" />
    <span
      v-if="!element.isTitleRenderedAsString && element.isRequireTextOnStart"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <span
      v-if="!element.isTitleRenderedAsString && element.no"
      style="position: static"
      :class="element.cssClasses.number"
      :aria-hidden="true"
      >{{ element.no }}</span
    >
    <span v-if="!element.isTitleRenderedAsString && element.no">&nbsp;</span>
    <span
      v-if="!element.isTitleRenderedAsString && element.isRequireTextBeforeTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <span v-if="!element.isTitleRenderedAsString && element.isRequireTextBeforeTitle">&nbsp;</span>
    <survey-string v-if="!element.isTitleRenderedAsString" :locString="element.locTitle" />
    <span v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle">&nbsp;</span>
    <span
      v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";

import Vue from "vue";
import { SurveyElementCore } from "survey-core";
@Component
export class TitleContent extends Vue {
  @Prop() element: any;
  @Prop() css: any;

}
Vue.component("survey-element-title-content", TitleContent);
export default TitleContent;
</script>
