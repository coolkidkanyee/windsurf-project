import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { Room } from 'colyseus.js';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit, OnDestroy {
  @Input() room: Room | null = null;
  @Input() players: any[] = [];

  showPasswordInput = false;
  showAdminMenu = false;
  password = '';
  attempts = 0;
  maxAttempts = 3;
  selectedPlayer = '';
  moneyAmount = 100;
  
  // Konami code: ↑↑↓↓←→←→BA
  private konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  private konamiIndex = 0;

  constructor() {}

  ngOnInit() {
    // Get room and players from parent component or service
    // This will be injected properly when integrated
  }

  ngOnDestroy() {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showAdminMenu) return;

    if (this.showPasswordInput) {
      if (event.key === 'Enter') {
        this.checkPassword();
      } else if (event.key === 'Escape') {
        this.closePasswordInput();
      }
      return;
    }

    // Check Konami code
    if (event.code === this.konamiCode[this.konamiIndex]) {
      this.konamiIndex++;
      if (this.konamiIndex === this.konamiCode.length) {
        this.showPasswordInput = true;
        this.konamiIndex = 0;
      }
    } else {
      this.konamiIndex = 0;
    }
  }

  checkPassword() {
    if (this.password.toLowerCase() === 'xbox') {
      this.showPasswordInput = false;
      this.showAdminMenu = true;
      this.password = '';
      this.attempts = 0;
    } else {
      this.attempts++;
      this.password = '';
      if (this.attempts >= this.maxAttempts) {
        this.closePasswordInput();
      }
    }
  }

  closePasswordInput() {
    this.showPasswordInput = false;
    this.password = '';
    this.attempts = 0;
  }

  closeAdminMenu() {
    this.showAdminMenu = false;
  }

  // Admin actions
  makeDealerLose() {
    if (this.room) {
      this.room.send('admin_dealer_lose');
    }
  }

  giveMoneyToPlayer() {
    if (this.room && this.selectedPlayer) {
      this.room.send('admin_give_money', { 
        playerId: this.selectedPlayer, 
        amount: this.moneyAmount 
      });
    }
  }

  takeMoneyFromPlayer() {
    if (this.room && this.selectedPlayer) {
      this.room.send('admin_take_money', { 
        playerId: this.selectedPlayer, 
        amount: this.moneyAmount 
      });
    }
  }

  givePlayerGifIcon() {
    if (this.room && this.selectedPlayer) {
      this.room.send('admin_give_gif', { 
        playerId: this.selectedPlayer 
      });
    }
  }

  makePlayerLose() {
    if (this.room && this.selectedPlayer) {
      this.room.send('admin_make_lose', { 
        playerId: this.selectedPlayer 
      });
    }
  }

  givePlayerBlackjack() {
    if (this.room && this.selectedPlayer) {
      this.room.send('admin_give_blackjack', { 
        playerId: this.selectedPlayer 
      });
    }
  }

  sendJumpscare() {
    if (this.room && this.selectedPlayer) {
      // Placeholder - not fully implemented yet
      console.log('Jumpscare feature coming soon...');
    }
  }

  getRemainingAttempts(): number {
    return this.maxAttempts - this.attempts;
  }
}
