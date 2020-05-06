import { Component, OnInit, OnDestroy} from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs';
import { RecipeService } from '../recipe.service';
import { UiService } from '../shared/ui.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  isLoading = false;

  isLoadingSubscription: Subscription;
  recipesSubscription: Subscription;
  userIdSubscription: Subscription;

  buttonActionName: string = "Delete";
  id: string;

  constructor(
    private dashboardService: DashboardService,
    private recipeService: RecipeService,
    private uiService: UiService,
    private authService: AuthService
    ) {
    this.recipes = [];
    this.authService.getCurrentUser();
  }

    ngOnInit(): void {
      this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
        this.isLoading = isLoading;
      });

      // user id
      this.userIdSubscription = this.authService.userIdSubject.subscribe(userId => {
        this.id = userId;
      });

      // Fetch Recipes
      this.dashboardService.fetchUserRecipes(this.id);

      this.recipesSubscription = this.dashboardService.recipesSubject.subscribe(recipes => {
        this.recipes = recipes;
      });
  }

  onRecipeDelete(id: string) {
    this.dashboardService.deleteRecipe(id);
  }

  ngOnDestroy() {
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }

    if (this.recipesSubscription) {
      this.recipesSubscription.unsubscribe();
    }

    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }


}
