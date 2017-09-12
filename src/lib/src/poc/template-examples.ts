import {
  AfterContentChecked, AfterContentInit, AfterViewInit, Component, ContentChild, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
  TemplateRef,
  ViewChild, ViewContainerRef
} from "@angular/core";

@Directive({
  selector: '[componentPlaceholder]'
})
export class ComponentPlaceholderDirective {
  constructor(public viewContainer: ViewContainerRef) {
  }
}

@Directive({selector: '[templatePlaceholder]'})
export class TemplatePlaceholderDirective {
  constructor(public viewContainer: ViewContainerRef) {
  }
}

@Directive({selector: '[messageDirective]'})
export class MessageDirective implements AfterContentInit, OnChanges {

  @Input() set messageComponent(messageComponent){
    console.log("INPUT:====> " + messageComponent);
  }

  @Input() set messageDirective(message: string){
    console.log("messageDirective: : " + message);
    //this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  //@Input('messageDirective') message: string;
  //@ContentChild(MessageComponent) messageComponent : MessageComponent;

  constructor(public templateRef: TemplateRef<any>,
              public viewContainerRef: ViewContainerRef) {
    console.log("messageDirective: constructor");
  }

  ngOnInit(){
    //console.log(this.message);
    //this.viewContainerRef.createEmbeddedView(this.templateRef);

  }

  ngAfterContentInit(): void {
    console.log("messageDirective: ngAfterContentInit");
    //console.log("messageDirective.message: " + this.message);
    console.log("=====> " + this.messageComponent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("1111");
    console.log("=====> " + this.messageComponent);
  }
}

@Component({
  selector: 'message-component',
  template: `
    <div>
      Message: {{message}}<br/>
      Age: {{age}}
    </div>
  `
})
export class MessageComponent implements  OnInit, AfterViewInit, OnDestroy, AfterContentInit, AfterContentChecked, OnChanges {

  @Input('component-attribute') componentAttribute: string;
  @Input('message') message: string;
  @Input('age') age: number;

  constructor(){
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterContentInit(): void {
    console.log(this.message);
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }
}

@Component({
  selector: 'template-example',
  template: `
    <div style="width: 600px; height: 300px; background-color: gainsboro; padding: 15px;">
      
      <ng-container componentPlaceholder></ng-container>
      
      <hr style="padding-top: 10px; padding-bottom: 10px;"/>
      
      <ng-container templatePlaceholder></ng-container>
      
      <ng-container>
        <message-component *messageDirective="let ctx" [message]="ctx.message" [age]="ctx.age">
          
        </message-component>
        <!--
        The <message-component> component is desugared into the following:
        
        <ng-template messageDirective let-message="$implicit">
          <message-component [message]="message"></message>
        </ng-template>
        -->
        
        <!-- 
        Note that if we declare a "let-xxx" attribute and we don't provide it in the context, then it will not use the template container value.
        For example, if we have an "email" value on the container component but we don't pass it in as an context variable (createEmbeddedView...), 
        then it will not resolve and will be viewed as undefined.
        
        Also notice that the "let-name" attribute does not have a value - it's the same as if I used "let-name='$implicit'" which is Angular's
        special way to have access to the variable only if the "$implicit" attribute was included in the context (createEmbeddedView...).
        
        Note that "message" cascades from the parent component which is the default context if not context attribute was provided, and very important,
        if it is not masked by a "let-xxx" attribute.  It does not use the parent component context if the "let-xxx" attribute is undefined. 
        -->  
        <ng-template #byeTemplate let-name let-email="email">
          <div>
            Goodbye Cruel World<br/>
            message={{message}},<br/>
            name={{name}}, <br/>
            surname={{surname}},<br/>
            email={{email}}
          </div>
        </ng-template>
      </ng-container>
    </div>
  `
})
export class TemplateExampleComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit, AfterContentChecked, OnChanges {

  @ViewChild(ComponentPlaceholderDirective) componentPlaceholderDirective: ComponentPlaceholderDirective;
  @ViewChild(TemplatePlaceholderDirective) templatePlaceholderDirective: TemplatePlaceholderDirective;

  @ViewChild('byeTemplate') byeTemplate: TemplateRef<any>;

  /*
  Very Important - remember, that when I add a structural directive to the message-component, the message-component is transformed
  into an ng-container with a ng-template inside.  So, this ViewChild will be undefined because there will not be such a component/element
  in the DOM anymore - it's translated to a template after the de-sugareazation of the directive
   */
  @ViewChild(MessageComponent) messageComponent: MessageComponent;
  @ViewChild(MessageDirective) messageDirective: MessageDirective;

  //@ViewChild('messageDirective') messageDirective: TemplateRef<any>;

  message: string = "This is the default template message";
  name: string = "Piet";
  surname: string = "Pompies";
  email: string = "test@test.com";

  constructor(){
  }

  ngAfterContentInit(): void {
    console.log("ngAfterContentInit: byeTemplate: " + this.byeTemplate);
    console.log("ngAfterContentInit: messageComponent: " + this.messageComponent);
    console.log("ngAfterContentInit: messageDirective: " + this.messageDirective);
    console.log("ngAfterContentInit: componentPlaceholderDirective: " + this.componentPlaceholderDirective);
    console.log("ngAfterContentInit: templatePlaceholderDirective: " + this.templatePlaceholderDirective);

    this.templatePlaceholderDirective.viewContainer.clear();
    this.templatePlaceholderDirective.viewContainer.createEmbeddedView(this.byeTemplate, {$implicit: "Jack", email: "jack@bla.com"});

    this.componentPlaceholderDirective.viewContainer.clear();
    let ref = this.componentPlaceholderDirective.viewContainer.createEmbeddedView(this.messageDirective.templateRef, {$implicit: {message: "Hello World", age: 40}, bla: "bling"});
    //console.log(ref.context);

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }
}