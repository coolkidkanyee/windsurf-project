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
  adminUnlocked = false;
  password = '';
  attempts = 0;
  maxAttempts = 3;
  selectedPlayer = '';
  moneyAmount = 100;
  selectedGifType = 'win';
  
  // Dragging functionality
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  menuPosition = { x: 0, y: 0 };
  
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
    // Insert key toggle (only works after admin is unlocked)
    if (event.key === 'Insert' && this.adminUnlocked) {
      this.showAdminMenu = !this.showAdminMenu;
      return;
    }

    if (this.showAdminMenu && this.adminUnlocked) return;

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
      this.adminUnlocked = true;
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

  // Dragging functionality
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    const rect = (event.target as HTMLElement).closest('.admin-menu')?.getBoundingClientRect();
    if (rect) {
      this.dragOffset.x = event.clientX - rect.left;
      this.dragOffset.y = event.clientY - rect.top;
    }
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.menuPosition.x = event.clientX - this.dragOffset.x;
      this.menuPosition.y = event.clientY - this.dragOffset.y;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  // Admin actions
  makeDealerLose() {
    if (this.room) {
      console.log('Sending admin_dealer_lose command');
      this.room.send('admin_dealer_lose');
    } else {
      console.error('No room connection for admin command');
    }
  }

  giveMoneyToPlayer() {
    if (this.room && this.selectedPlayer) {
      console.log(`Sending admin_give_money: ${this.moneyAmount} to ${this.selectedPlayer}`);
      this.room.send('admin_give_money', { 
        playerId: this.selectedPlayer, 
        amount: this.moneyAmount 
      });
    } else {
      console.error('Missing room or selectedPlayer for give money command');
    }
  }

  takeMoneyFromPlayer() {
    if (this.room && this.selectedPlayer) {
      console.log(`Sending admin_take_money: ${this.moneyAmount} from ${this.selectedPlayer}`);
      this.room.send('admin_take_money', { 
        playerId: this.selectedPlayer, 
        amount: this.moneyAmount 
      });
    } else {
      console.error('Missing room or selectedPlayer for take money command');
    }
  }

  givePlayerGifIcon() {
    if (this.room && this.selectedPlayer) {
      console.log(`Sending admin_give_gif: ${this.selectedGifType} to ${this.selectedPlayer}`);
      this.room.send('admin_give_gif', { 
        playerId: this.selectedPlayer,
        gifType: this.selectedGifType
      });
    } else {
      console.error('Missing room or selectedPlayer for give gif command');
    }
  }

  makePlayerLose() {
    if (this.room && this.selectedPlayer) {
      console.log(`Sending admin_make_lose to ${this.selectedPlayer}`);
      this.room.send('admin_make_lose', { 
        playerId: this.selectedPlayer 
      });
    } else {
      console.error('Missing room or selectedPlayer for make lose command');
    }
  }

  givePlayerBlackjack() {
    if (this.room && this.selectedPlayer) {
      console.log(`Sending admin_give_blackjack to ${this.selectedPlayer}`);
      this.room.send('admin_give_blackjack', { 
        playerId: this.selectedPlayer 
      });
    } else {
      console.error('Missing room or selectedPlayer for give blackjack command');
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
