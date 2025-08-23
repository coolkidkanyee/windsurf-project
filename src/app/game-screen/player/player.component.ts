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
        profilePicturePreview: this.player.profilePicture?.substring(0, 50) + '...'
      });
    }
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
}
