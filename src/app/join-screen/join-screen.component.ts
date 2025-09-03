import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import gameConfig from 'backend/src/game.config';
import { GameService } from '../game.service';

@Component({
  selector: 'app-join-screen',
  templateUrl: './join-screen.component.html',
  styleUrls: ['./join-screen.component.scss'],
})
export class JoinScreenComponent implements OnInit {
  roomId = new FormControl('', [
    Validators.required,
    Validators.minLength(gameConfig.roomIdLength),
    Validators.maxLength(gameConfig.roomIdLength),
  ]);

  playerName = new FormControl('');
  profilePicturePreview: string | null = null;
  profilePictureData: string = '';
  version: string = '';

  joinButtonInvalidTooltip = `Room ID needs to be ${gameConfig.roomIdLength} letters long.`;

  constructor(public game: GameService, private http: HttpClient) {}

  ngOnInit() {
    this.loadVersion();
  }

  loadVersion() {
    this.http.get<{version: string}>('/windsurf-project/assets/version.json').subscribe({
      next: (data) => {
        this.version = data.version;
        console.log('Version loaded:', this.version);
      },
      error: (err) => {
        console.error('Error loading version:', err);
        this.version = '1.38';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        alert('Image size must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          // Resize image to 64x64 pixels to keep it small
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          canvas.width = 64;
          canvas.height = 64;
          
          // Draw image scaled to fit canvas
          ctx.drawImage(img, 0, 0, 64, 64);
          
          // Convert to base64 with reduced quality
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          this.profilePicturePreview = resizedBase64;
          this.profilePictureData = resizedBase64;
          
          console.log('Profile picture processed:', {
            originalSize: file.size,
            base64Length: resizedBase64.length,
            preview: resizedBase64.substring(0, 100) + '...'
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearProfilePicture() {
    this.profilePicturePreview = null;
    this.profilePictureData = '';
  }
}
