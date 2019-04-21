import { Component, OnInit } from '@angular/core';
import { HubConnection ,HubConnectionBuilder} from '@aspnet/signalr';
import { ReturnMessage } from '../Model/ReturnMessage';
import { CookieService } from 'ngx-cookie-service';
import { CheckBoxService } from '../service/check-box.service';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { EachChatHistory } from '../Model/EachChatHistory';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private hubConnection: HubConnection;
  nick = '';
  message = '';
  publicMessage='';
  sendTime=new Date();
  messages: any[] = [];
  allData:any[];
  resourceList: any = {};
  model: any = {};
  senderId:number;
  recvId:number;
  chatHistoryList: any = {};
  returnMessage:ReturnMessage; //model class for storing return data

  parameterChatList:EachChatHistory; //model class for storing parameter from view

  returnList:ReturnMessage[]=[]; //make a list for data which server sent by single elements
  PrivateReturnList:ReturnMessage[]=[]; //make a list for data which server sent for private chat
  chatlistGroup: { receiverId: string; sendTo: string, chatlist: any; }[];
  requestParam:number;
  chatPairId:number;
  addPerson:number;

  constructor(private cookie:CookieService ,private service: CheckBoxService) { }

  ngOnInit() {
    this.nick=this.cookie.get("loggedInUser"); //get the user who in logged in by using cookie
    this.senderId=+this.cookie.get("loggedInUserId");//get the userId of who logged in by using cookie

    console.log(this.senderId);
  //get the history of chat

    this.service.getChatHistory(this.senderId).subscribe((data) => {
      this.groupByTask(data);
      console.log("after added grouped");

      //this.returnList = data;
      console.log(this.chatlistGroup);


    })

    this.service.getUserList().subscribe((data) => {
      this.resourceList = data;
    })

 

    this.hubConnection =new HubConnectionBuilder().withUrl("http://localhost:61895/chatHub").build();

//Here hub connection will start
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started!');
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA")
      })
      .catch(err => console.log('Error while establishing connection !'));


      this.hubConnection.on('SendMessage', (data) => {
        console.log("Return list");
        console.log(data);
        this.returnMessage = data;
        this.returnList.push(this.returnMessage);
      });


      //return from private chat
      this.hubConnection.on('PrivateSendMessage', (data) => {
        console.log("Return private list");
        console.log(data);
        this.returnMessage = data;
        this.PrivateReturnList.push(this.returnMessage);
      });
  }

  public sendMessage(): void {
  console.log(this.publicMessage)
  console.log(this.nick)
  console.log(this.sendTime)
  console.log(this.model.userId)
  console.log(this.senderId)

    this.hubConnection
    .invoke('SendMessage',this.nick,this.model.userId,this.publicMessage,this.sendTime,this.senderId,this.model.userName)
    .catch(err => console.error(err));
  }


  //This method for private chat responses
  public privateSendMessage(chatPairId): void {
    console.log(this.message)
    console.log(this.nick)
    console.log(this.sendTime)
    console.log(this.model.userId)
    console.log(this.senderId)
    console.log(chatPairId)
    //chatPairId
  
      this.hubConnection
      .invoke('PrivateSendMessage',this.nick,chatPairId,this.message,this.sendTime,this.senderId)
      .catch(err => console.error(err));
    }

  //This is the method for grouping elements 
  groupByTask(grouplists: any[]) {
    const groups = grouplists.reduce(function (obj, item) {
      obj[item.receiverId] = obj[item.receiverId] || [];
      obj[item.receiverId].push(item);
      return obj;
    }, {});
    this.chatlistGroup = Object.keys(groups).map(function (key) {
      return { receiverId: key,sendTo: groups[key][0].sendTo, chatlist: groups[key] };
    });

  }

  //get each one chat list history


  getEachChat(requestParam){
    this.chatPairId=requestParam;
console.log("This is the pair id");
console.log(this.chatPairId);
    var _parameterChatList:EachChatHistory= {receiverId:requestParam, loggedinuserid:this.senderId};
    this.service.getChatEachHistory(_parameterChatList).subscribe((data) => {
      this.PrivateReturnList=data;
      console.log("each data history");
      console.log(data);

    })

  }


  AddPerson(addPerson){
    this.service.addAnotherUser(this.addPerson).subscribe((data) => {

    })

  }

}
