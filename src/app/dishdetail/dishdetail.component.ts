import { Component, OnInit, ViewChild, Input , Inject} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut} from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(), flyInOut(),
  ]
})


export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  today: Date = new Date();
  errMess: string;

  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  visibility = 'shown'

  @ViewChild('fform')  
    commentFormDirective;
  
  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
    'date': '',
  }
  
  validationMessages = {
    'author' : {
      'required': 'Author is required',
      'minlength': 'Author must be at least 2 characters long',
    },
    'comment': {
      'required': 'Please enter any messages',
    },
  };
  

  constructor(private dishService: DishService, 
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder, @Inject('BaseURL') public BaseURL) { this.createForm()
    } ;

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id'])}))
    .subscribe(dish => {this.dish= dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility ='shown'} , errmess => this.errMess = <any>errmess );
      
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1 )%this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index +1 )%this.dishIds.length]

  }

  goBack(): void {
    this.location.back();
  }


  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5'],
      comment: ['', [Validators.required]],
    });


  this.commentForm.valueChanges
    .subscribe(data=> this.onValueChanged(data));

  this.onValueChanged(); // (re)set form validataion messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return;}
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] ='';
        const control =form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
     errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess});
    this.commentForm.reset({
      'auhtor': '',
      'rating': '',
      'comment': '',
      'date': '',
    });
    this.commentFormDirective.resetForm();
  }

}


