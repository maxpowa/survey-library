<template>
  <div v-bind:class="model.cssClasses.root" ref="listContainerElement">
    <div v-bind:class="model.cssClasses.filter" v-if="model.showFilter">
      <div v-bind:class="model.cssClasses.filterIcon">
        <sv-svg-icon :iconName="'icon-search'" :size="'auto'"> </sv-svg-icon>
      </div>
      <input
        type="text"
        v-bind:class="model.cssClasses.filterInput"
        :aria-label="model.filterStringPlaceholder"
        :placeholder="model.filterStringPlaceholder"
        :value="model.filterString"
        @change="change"
        @keyup="keyup"
      />
    </div>
    <div v-bind:class="model.cssClasses.emptyContainer" v-show="model.isEmpty">
      <div v-bind:class="model.cssClasses.emptyText" :aria-label="model.emptyMessage">{{ model.emptyMessage }}</div>
    </div>
    <ul
      v-bind:class="model.cssClasses.itemsContainer"
      role="listbox"
      @mousedown="
        (event) => {
          event.preventDefault();
        }
      "
      @mousemove="mouseMove"
      v-on:keydown="
        (event) => {
          model.onKeyDown(event);
        }
      "
    >
      <sv-list-item
        v-for="item in model.renderedActions"
        :item="item"
        :model="model"
        :key="item.id"
      >
      </sv-list-item>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ListModel } from "survey-core";
import { BaseVue } from "../../base";

export * from "./list-item.vue";

@Component
export class List extends BaseVue {
  @Prop() model: ListModel;
  constructor() {
    super();
  }
  getModel() {
    return this.model;
  }
  change(event: any) {
    this.model.filterString = event.target.value;
  }
  keyup(event: any) {
    this.model.filterString = event.target.value;
    this.model.goToItems(event);
  }
  mouseMove(event: any) {
    this.model.onMouseMove(event);
  }
  protected onMounted() {
    const listContainerElement: any = this.$refs["listContainerElement"];
    this.model.initListContainerHtmlElement(listContainerElement);
  }
}

Vue.component("sv-list", List);
export default List;
</script>
