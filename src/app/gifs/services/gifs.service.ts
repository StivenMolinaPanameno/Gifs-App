import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import{HttpClient, HttpParams} from '@angular/common/http'


@Injectable({providedIn: 'root'})
export class GifsService {

  public gifsList:Gif[] = [];
  private _tagHistory:string[] = [];
  private apiKey:string = 'C5GTJSnRFsciEV8JaaPWM31ICiE8xWqi';
  private serviceUrl:string = 'https://api.giphy.com/v1/gifs';

  constructor(private http:HttpClient){
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagHistory(){
    return [...this._tagHistory];
  }

  private organizeHistory(tag:string){
    tag = tag.toLowerCase();
    if(this._tagHistory.includes(tag)){
      this._tagHistory = this._tagHistory.filter((oldtag) => oldtag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);
    this.saveLocalStorage();

  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')){
      return;
    }
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagHistory[0]);
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  async searchTag(tag:string):Promise<void>{
    this.organizeHistory(tag);
    if(tag.length === 0) return;
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search?`, {params})
    .subscribe((resp) => {
      this.gifsList = resp.data;
      console.log({gifs: this.gifsList});
    })

  }

}
