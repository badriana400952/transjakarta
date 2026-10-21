export interface JsonApiRelationship {
  data: {
    id: string
    type: string
  } | null
}




export interface VehicleAttributes {
  label: string
  current_status: 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'INCOMING_AT' | string
  current_stop_sequence?: number
  direction_id?: number
  latitude: number
  longitude: number
  bearing?: number
  speed?: number | null
  occupancy_status?: string | null
  updated_at: string
}


export interface Vehicle {
  id: string
  type: 'vehicle'
  attributes: VehicleAttributes
  relationships?: {
    route?: JsonApiRelationship
    trip?: JsonApiRelationship
    stop?: JsonApiRelationship
  }
}

export interface RouteAttributes {
  short_name: string
  long_name: string
  description?: string
  color?: string
  text_color?: string
  type?: number
  fare_class?: string
  direction_names?: string[]
  direction_destinations?: string[]
}

export interface RouteItem {
  id: string
  type: 'route'
  attributes: RouteAttributes
}

export interface TripAttributes {
  headsign: string
  name: string
  direction_id?: number
  block_id?: string
  wheelchair_accessible?: number
}

export interface TripItem {
  id: string
  type: 'trip'
  attributes: TripAttributes
  relationships?: {
    route?: JsonApiRelationship
  }
}





export interface ApiResponse<T> {
  data: T[]
  included?: Array<RouteItem | TripItem | Record<string, unknown>>
  links?: {
    first?: string
    prev?: string
    next?: string
    last?: string
  }
}

export interface VehicleEnriched extends Vehicle {
  routeData?: RouteItem
  tripData?: TripItem
}

export interface VehicleFilterParams {
  selectedRoutes: string[]
  selectedTrips: string[]
  pageLimit: number
  pageOffset: number
}
