import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IPokemon, IPokemonNew} from "../interface/IPokemon.interface";
import {HttpClient} from "@angular/common/http";
import {PokemonService} from "../service/pokemon.service";

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  allPokemon: IPokemon[] = [];
  filteredPokemon: IPokemon[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPokemons: number = 0;
  selectedPokemon: IPokemon[] = [];
  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private pokemonService: PokemonService) {
  }

  async ngOnInit() {
    this.form = this.formBuilder.group({
      pokemonName: ['', [Validators.required]]
    });
    await this.getAllPokemon();
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    } else {
      this.onSearchPokemon()
    }
  }

  onSearchPokemon() {
    const pokemonName = this.form.value.pokemonName;
    this.pokemonService.getPokemon(pokemonName)
      .subscribe((pokemonData: any) => {
        pokemonData.forEach((data: IPokemon) => {
          this.pokemonService.findImage(data.Name).subscribe((image: any) => {
            data.imageUrl = image.sprites.front_default;
            this.selectedPokemon.push(data);
          });
        });
      });
  }

  async getAllPokemon() {
    this.pokemonService.getPokemons()
      .subscribe((data: any) => {
        this.allPokemon = data.result;
      });
  }

  async onNextPage() {
    this.currentPage++;
    await this.getAllPokemon();
  }

  async onPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.getAllPokemon();
    }
  }

  getPageCount(): number {
    return Math.ceil(this.totalPokemons / this.pageSize);
  }


}
