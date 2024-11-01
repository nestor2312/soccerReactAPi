import "./esilosElin.css";
const PruebaElinmi = () => {
    return<><h1>eliminatorias cuadro</h1>
<div className="col-sm-12 col-md-12 mt-4">
        <div className="card mt-2 border-0 shadow">
          <div className="card-header fondo-card TITULO border-0">Eliminatorias</div>
            <div className="titulos">
              <div className="titulo"  >Cuartos</div>
              <div className="titulo" >Semis</div>
              <div className="titulo" >Final</div>
              <div className="titulo" >Campeón</div>
            </div>
          <div>
            <div className="esquema">
              <div className="jornada_contenedor">
                  {/* {{--cuartos --}}        */}
    
     {/* @foreach ($eliminatoriasCuartos as $partido) */}
        <div className="partido">
            <div className="jornada">
                <div className="jugador {{ $partido->marcador1 > $partido->marcador2 ? 'win' : '' }}">  
                    {/* @if ($partido->equipoA) {{-- Si el id existe muestra los datos: imagen, nombre y marcador  --}} */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">2</span>   
                    {/* @else {{-- Si el id es null entonces muestra tu mensaje --}}
                    <p>Por definir</p>  
                    @endif */}
                </div>                                                                                                                                            
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">4</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">2</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">5</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">6</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">7</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">58</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
                <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">
                    {/* @if ($partido->equipoB) */}
                    <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">2</span>     
                    {/* @else
                    <p>Por definir</p>  
                    @endif */}
                </div>
            </div>                  
        </div>
    {/* @endforeach  */}
              </div>  
              {/* {{-- Conectores de octavos a cuartos --}} */}
              <div className="conectores">
                  <div className="conector">
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div> 
                  </div>       
          
                  <div className="conector">
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div> 
                  </div>
          
                  <div className="conector">
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div> 
                  </div>
          
                  <div className="conector">
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div> 
                  </div>
              </div>
          
              {/* {{--cuartos --}} */}
    
              <div className="jornada_contenedor">
                {/* @foreach ($eliminatoriasSemis as $partido)   */}
                <div className="jornada">   
                    <div className=" jugador {{ $partido->marcador1 > $partido->marcador2 ? 'win' : '' }}">  
                        {/* @if ($partido->equipoA) */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">5</span>   
                            {/* @else {{-- Si el id es null entonces muestra tu mensaje --}}                                             
                            <p>Por definir</p>  
                            @endif */}
                        </div>           
                </div>               
    
                <div className="jornada">          
                    <div className=" jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">     
                        {/* @if ($partido->equipoB)     */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">7</span>                                               
                            {/* @else        
                            <p>Por definir</p>  
                            @endif */}
                        </div> 
                </div>        
                <div className="jornada">          
                    <div className=" jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">     
                        {/* @if ($partido->equipoB)     */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">5</span>                                               
                            {/* @else        
                            <p>Por definir</p>  
                            @endif */}
                        </div> 
                </div>    
                <div className="jornada">          
                    <div className=" jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}">     
                        {/* @if ($partido->equipoB)     */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">6</span>                                               
                            {/* @else        
                            <p>Por definir</p>  
                            @endif */}
                        </div> 
                </div>    
                          
                {/* @endforeach                 */}
               
               
    
    </div>
    
    
              {/* {{-- Conectores de cuartos a semifinal --}} */}
              <div className="conectores">
                  <div className="conector">
                      <div className="conector_doble conector_doble_semifinal"></div>
                      <div className="conector_simple"></div> 
                  </div>       
          
                  <div className="conector">
                      <div className="conector_doble conector_doble_semifinal"></div>
                      <div className="conector_simple"></div> 
                  </div>
              </div>
              {/* {{-- final --}}     */}
              <div className="jornada_contenedor">
                   {/* @foreach ($eliminatoriasFinal as $partido)   */}
                  <div className="jornada">            
                          <div className="conector_doble"></div>
                          <div className="conector_simple"></div>            
                        <div className="jugador {{ $partido->marcador1 > $partido->marcador2 ? 'win' : '' }}"> 
                            {/* @if ($partido->equipoA) */}
                            <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">9</span>   
                              {/* @else                                           
                              <p>Por definir</p>     
                            @endif */}
                       
                      </div>        
                  </div>
          
                  <div className="jornada">            
                          <div className="conector_doble"></div>
                          <div className="conector_simple"></div>
                       <div className="jugador {{ $partido->marcador2 > $partido->marcador1 ? 'win' : '' }}"> 
                        {/* @if ($partido->equipoB) */}
                        <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                        <span className="goles">5</span>   
                        {/* @else                                            
                            <p>Por definir</p>    
                        @endif */}
                            </div>        
                        </div>
                        {/* @endforeach  */}
                      
              </div>
          
              {/* {{-- Conectores de semifinal a ganador --}} */}
              <div className="conectores">
                  <div className="conector">
                      <div className="conector_doble conector_doble_ganador"></div>
                      <div className="conector_simple"></div> 
                  </div>            
              </div>
                  
              {/* {{-- Ganador --}} */}
              <div className="ganador_esquema">
                  <div className="ganador ">         
                    {/* @if ($eliminatoriasFinal) */}
                    {/* @if ($partido->equipoA && $partido->equipoB) */}
                        <div className="conector_doble"></div> 
                        <div className="conector_simple"></div>            
                        {/* @if ($partido->marcador1 !== null && $partido->marcador2 !== null) */}
                            {/* @if ($partido->marcador1 == $partido->marcador2) */}
                                {/* <div className="jugador">
                                    <span className="equipo">Por definir</span> 
                                </div> */}
                            {/* @elseif ($partido->marcador2 > $partido->marcador1) */}
                                <div className="jugador win"> 
                                <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                    
                                </div>
                            {/* @else */}
                                {/* <div className="jugador win">
                                <img src="{{ url('imagenes').'/'.$partido->equipoA->imagen }}" className="logo" alt="sin imagen"/>            
                        <span className="equipo">nombre</span>
                      
                                </div> */}
                            {/* @endif */}
                        {/* @else */}
                            {/* <div className="jugador">
                                <span className="equipo">No definido</span> 
                            </div> */}
                        {/* @endif */}
                    {/* @else */}
                        {/* <div className="jugador">
                            <span className="equipo">No definido</span> 
                        </div> */}
                    {/* @endif */}
                {/* @endif */}
                
    
                  </div>   
                  
              <div>
    
          </div>
      
          </div>
          
      </div>
     
      </div>

  </div>  
</div>
     
      
</>
}

export default PruebaElinmi;