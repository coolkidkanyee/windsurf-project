import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card, Hand, Player } from 'backend/src/rooms/schema/GameState';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() player?: Player;
  @Input() dealerHand?: Hand;
  @Input() type: 'dealer' | 'player' = 'player';

  @Input() scoreBottom: boolean | null = false;

  // For this component:
  // Player = The player that is passed into the component, can be client or any other player
  // Client = The player that is using this game instance

  @Output() kick = new EventEmitter<string>();
  @Input() isPlayerTurn: boolean = false;
  @Input() endTimestamp: number = 0;
  @Input() clientIsPlayer: boolean = false;
  @Input() clientIsAdmin?: boolean = false;

  ngOnInit() {
    // Debug profile picture data
    if (this.player) {
      console.log('Player data:', {
        name: this.player.displayName,
        hasProfilePicture: !!this.player.profilePicture,
        profilePictureLength: this.player.profilePicture?.length || 0,
        profilePicturePreview: this.player.profilePicture?.substring(0, 50) + '...',
        winStreak: this.player.winStreak,
        lossStreak: this.player.lossStreak,
        money: this.player.money
      });
    }
  }

  hasProfilePicture(): boolean {
    return !!(this.player?.profilePicture && this.player.profilePicture.length > 0);
  }

  get hand() {
    return this.player?.hand || this.dealerHand;
  }

  public roundOutcomeToDisplayMessage = {
    bust: 'Busted',
    win: 'Win',
    lose: 'Lose',
    draw: 'Draw',
    '': '',
  };

  public roundOutcomeToDisplayMessageCurrentPlayer = {
    bust: 'Busted',
    win: 'You Won!',
    lose: 'You Lost!',
    draw: 'Draw',
    '': '',
  };

  shouldShowWinStreak(): boolean {
    return !!(this.player && this.player.winStreak >= 3 && this.type !== 'dealer');
  }

  shouldShowLossStreak(): boolean {
    const result = !!(this.player && 
           this.type !== 'dealer' &&
           (this.player.lossStreak >= 3 || this.player.money < 0));
    
    if (this.player && this.type !== 'dealer') {
      console.log('Loss streak check:', {
        playerName: this.player.displayName,
        lossStreak: this.player.lossStreak,
        money: this.player.money,
        shouldShow: result,
        condition: `lossStreak(${this.player.lossStreak}) >= 3 OR money(${this.player.money}) < 0`
      });
    }
    
    return result;
  }

  getWinStreakTooltip(): string {
    return `${this.player?.winStreak || 0} wins in a row`;
  }

  getLossStreakTooltip(): string {
    if (this.player && this.player.money < 0) {
      return `${this.player.lossStreak || 0} losses in a row (negative money)`;
    }
    return `${this.player?.lossStreak || 0} losses in a row`;
  }
}
