import { GameObject } from './game-object.model';

export class DemoItem extends GameObject {

  public static EQUIPMENT = [
    // Starter Gear
    new DemoItem('weapon', 'Bear Knuckles', [['attack', 5]], ['mainHand', 'offHand'], null, '#d575ef', 'starter', 'Basic Stuff'),
    new DemoItem('armor', 'Torn Kilt', [['defense', 1]], ['legSlot'], null, '#d575ef', 'starter', 'Basic Stuff'),
    new DemoItem('armor', 'Tabard', [['defense', 1]], ['chestSlot'], null, '#d575ef', 'starter', 'Basic Stuff'),
    new DemoItem('armor', 'Cap', [['defense', 1]], ['headSlot'], null, '#d575ef', 'starter', 'Basic Stuff'),
    // Potions
    new DemoItem('consumable', 'Health Potion', [['health', 30]], ['potions'], null, '#ff3f3f', 'highArray', 'A health potion'),
    new DemoItem('consumable', 'Attack Potion', [['attack', 5]], ['potions'], null, '#ff3f3f', 'highArray', 'An attack potion'),
    new DemoItem('consumable', 'Strength Potion', [['strength', 5]], ['potions'], null, '#ff3f3f', 'highArray', 'A strength potion'),
    new DemoItem('consumable', 'Defense Potion', [['defense', 5]], ['potions'], null, '#ff3f3f', 'highArray', 'A defense potion'),
    // Low Drops
    new DemoItem('armor', 'Iron Helm', [['defense', 20]], ['headSlot'], {trait: 'defense', level: 20}, '#cecece', 'lowGear', 'Defense level needs to be atleast 10 to wear this, noob'),
    new DemoItem('armor', 'Iron Chestplate', [['defense', 20]], ['chestSlot'], {trait: 'defense', level: 20}, '#cecece', 'lowGear', 'Defense level needs to be atleast 10 to wear this, noob'),
    new DemoItem('armor', 'Iron Greaves', [['defense', 20]], ['legSlot'], {trait: 'defense', level: 20}, '#cecece', 'lowGear', 'Defense level needs to be atleast 10 to wear this, noob'),
    new DemoItem('weapon', 'Sword', [['strength', 20], ['attack', 20]], ['mainHand'], null, '#cecece', 'lowGear', 'Even noobs can use this item'),
    new DemoItem('armor', 'Shield', [['defense', 30]], ['offHand'], null, '#cecece', 'lowGear', 'Even noobs can use this item'),
    new DemoItem('weapon', 'Claymore', [['strength', 40]], ['mainHand', 'offHand'], {trait: 'strength', level: 20}, '#cecece', 'lowGear', 'You strength expertise must be 20 or greater to wield these, braveheart'),
    // Med Drops
    new DemoItem('armor', 'Mithril Helm', [['defense', 40]], ['headSlot'], {trait: 'defense', level: 20}, '#cecece', 'medGear', 'Defense level needs to be atleast 20 to wear this, scrub'),
    new DemoItem('armor', 'Mithril Chestplate', [['defense', 40]], ['chestSlot'], {trait: 'defense', level: 20}, '#cecece', 'medGear', 'Defense level needs to be atleast 20 to wear this, scrub'),
    new DemoItem('armor', 'Mithril Greaves', [['defense', 40]], ['legSlot'], {trait: 'defense', level: 20}, '#cecece', 'medGear', 'Defense level needs to be atleast 20 to wear this, scrub'),
    new DemoItem('weapon', 'Katana', [['attack', 10], ['strength', 120]], ['mainHand', 'offHand'], {trait: 'attack', level: 60}, '#7ca0f9', 'medGear', 'You think you can wield the Katana, young one, try again when your attack level is 60'),
    new DemoItem('weapon', 'Nunchucks', [['attack', 50], ['strength', 50]], ['mainHand', 'offHand'], {trait: 'attack', level: 35}, '#7ca0f9', 'medGear', 'You attack expertise must be 35 or greater to wield these, kneenja'),
    new DemoItem('weapon', 'Main Hand Scimitar', [['strength', 65]], ['mainHand'], {trait: 'attack', level: 20}, '#7ca0f9', 'medGear', 'You need atleast 20 attack to equip this weapon, scrub'),
    new DemoItem('weapon', 'Off Hand Scimitar', [['attack', 60]], ['offHand'], {trait: 'attack', level: 20}, '#7ca0f9', 'medGear', 'You need atleast 20 attack to equip this weapon, scrub'),
    // High Drops
    new DemoItem('armor', 'Robin Hood Hat', [['attack', 150]], ['headSlot'], {trait: 'defense', level: 60}, 'green', 'rareGear', 'Defense level needs to be atleast 60 to wear this, pleeb'),
    new DemoItem('armor', 'Gladiator Chestplate', [['strength', 150]], ['chestSlot'], {trait: 'defense', level: 100}, '#d575ef', 'rareGear', 'Defense level needs to be atleast 100 to wear this, pleeb'),
    new DemoItem('weapon', 'Main Hand Kitten Bomb', [['strength', 120], ['attack', 80]], ['mainHand'], {trait: 'attack', level: 60}, '#d575ef', 'rareGear', 'You need at least 60 attack to throw the kitties'),
    // Epic Drops
    new DemoItem('armor', 'Chad\'s Legs(ULTIMA)', [['attack', 300], ['defense', -100]], ['legSlot'], {trait: 'defense', level: 100}, '#d575ef', 'epicGear', 'Defense level needs to be atleast 100 to wear these bad boys, pleeb'),
    new DemoItem('weapon', 'Blue Light Saber', [['attack', 200], ['strength', 200]], ['mainHand'], {trait: 'attack', level: 100}, 'blue', 'epicGear', 'You aren\'t strong enough with the force yet, 100 attack level to wield this weapon, you must have, Skywalker'),
    new DemoItem('weapon', 'Green Light Saber', [['attack', 200], ['strength', 200]], ['offHand'], {trait: 'attack', level: 100}, 'green', 'epicGear', 'You aren\'t strong enough with the force yet, 100 attack level to wield this weapon, you must have, Skywalker'),
    new DemoItem('weapon', 'Illidan\'s Warglaive', [['attack', 100], ['strength', 400]], ['offHand', 'mainHand'], {trait: 'attack', level: 100}, '#ed8055', 'epicGear', 'Come back when your attack level is at least 100 you stupid demon hunter'),
    new DemoItem('armor', 'Armour Forged From Sam\'s Crocks', [['defense', 450], ['strength', -100]], ['chestSlot'], null, '#4d843e', 'epicGear', 'These are comfortable and practical'),
    new DemoItem('armor', 'Minhish Cap(ULTIMA)', [['defense', 100], ['attack', 200]], ['headSlot'], null, '#ed8055', 'epicGear', 'This hat makes you deadly with code'),
    new DemoItem('armor', 'Derek\'s Spinner', [['strength', 300]], ['mainHand'], null, '#ed8055', 'epicGear', 'It\'s outta control'),
    new DemoItem('armor', 'Shield of Law-rence', [['defense', 300]], ['offHand'], null, '#ed8055', 'epicGear', 'You are an impenetrable wall of the law'),
    // Grave Gear
    new DemoItem('weapon', 'Tombstone', [['strength', 200], ['attack', -40]], ['mainHand', 'offHand'], null, '#d575ef', 'graveGear', 'BAM'),
    new DemoItem('armor', 'Pumpkin Head', [['defense', 70], ['attack', -10]], ['headSlot'], null, '#d575ef', 'graveGear', 'You look like a foo, but it\'s hard to hit you'),
    new DemoItem('armor', 'Rickety Ribcage', [['defense', 55]], ['chestSlot'], null, '#d575ef', 'graveGear', 'There might still be goop in there'),
    new DemoItem('weapon', 'Main Hand Bone Dagger', [['strength', 75]], ['mainHand'], null, '#d575ef', 'graveGear', 'Pretty Humourous'),
    new DemoItem('weapon', 'Off Hand Bone Dagger', [['attack', 75]], ['offHand'], null, '#d575ef', 'graveGear', 'Pretty Humourous'),
    // North Gear
    new DemoItem('armor', 'Ushanka-hat', [['defense', 120], ['attack', 50]], ['headSlot'], null, 'white', 'northGear', 'It has ear flaps!'),
    new DemoItem('armor', 'Grizzley Fur Coat', [['defense', 30], ['strength', 150]], ['chestSlot'], null, 'white', 'northGear', 'It has ear flaps!'),
    new DemoItem('weapon', 'Ice Picks', [['attack', 60], ['strength', 60]], ['offHand', 'mainHand'], null, 'white', 'northGear', 'You could probable climb a mountain'),
    new DemoItem('weapon', 'LongClaw', [['strength', 200]], ['mainHand'], null, 'white', 'northGear', 'Winter is here'),
    // Swamp Gear
    new DemoItem('armor', 'Tribal Shield', [['defense', 100]], ['offHand'], null, '#4d843e', 'swampGear', 'It\'s totally authentic'),
    new DemoItem('weapon', 'Double Hatchets', [['strength', 100], ['attack', -20]], ['mainHand', 'offHand'], null, '#4d843e', 'swampGear', 'It\'s totally authentic'),
    new DemoItem('weapon', 'Voodoo Machete', [['strength', 100]], ['mainHand'], null, '#4d843e', 'swampGear', 'It\'s totally authentic'),
    new DemoItem('armor', 'Hex Greaves', [['defense', 70]], ['legSlot'], null, '#4d843e', 'swampGear', 'It\'s totally authentic'),
    new DemoItem('armor', 'Shrunken Head', [['defense', 80]], ['headSlot'], null, '#4d843e', 'swampGear', 'Grooooooss')
  ]

  constructor(public type: string, public name: string, public modifier, public equipPosition: string[], public requirements, public color: string, public lootTable: string, public alert: string) {
    // alert: the message that appears when you cannot equip the Item
    // modifier: an array of arrays[[health, 0], [strength, 0], [attack, 0], [defense, 0]]
    // equipPosition: array of strings to see where to equip the item: equipPosition ['mainHand', 'offHand']}
    // requirements: array of objects to say what the requirements are: requirements = {trait: 'strength', level: 30}
    // color: the color of the item
    // loot table
  super(type);
  this.collidable = false;
  }
}
