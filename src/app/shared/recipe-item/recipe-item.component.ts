import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from 'src/app/recipe.service';
import { Recipe } from 'src/app/models/recipe.model';
import { UiService } from '../ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements OnInit, OnDestroy {
  @Input() recipe: Recipe = null;
  @Input() actionName: string = "";
  @Output() buttonAction = new EventEmitter<Recipe>();

  isLoading = false;
  loadingSubscription: Subscription;


  constructor(private recipeService: RecipeService, private uiService: UiService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  onClick() {
    this.recipeService.searchRecipe(this.recipe.uri);
  }

  onButtonClick() {
    this.buttonAction.emit(this.recipe);
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
