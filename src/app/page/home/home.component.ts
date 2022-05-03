import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  socket: any;
  @ViewChild('myCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  private lazyStream: any;
  currentPeer: any;

  constructor() {
    this.socket = io.connect('http://localhost:5000', { transports : ['websocket'] });
  }

  ngOnInit() {
    // this.shareScreen()
    this.socket.on('connection', function () {
      console.log("socket connected to http://localhost:8080");
    });

    this.socket.emit('canvas', 'hhhhhhhhhhhhhhhhhhhhhh');

    //read video stream
    this.socket.on('canvas', function (data: any) {
      console.log(data);

      navigator.mediaDevices.getDisplayMedia({
        video: {
          // cursor: 'always'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      }).then(stream => {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
  
        const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
        sender.replaceTrack(videoTrack);
      }).catch(err => {
        console.log('Unable to get display media ' + err);
      });
     
    });

    // this.socket.on('disconnect', function (exception: any) {
    //   console.log("socket disconnect");
    //   //this.disconnect(true);
    //   //this.destroy();
    // });

  }

  shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }

}
