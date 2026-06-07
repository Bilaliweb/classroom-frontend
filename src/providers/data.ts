import { BACKEND_BASE_URL } from '@/constants'
import { CreateResponse, GetOneResponse, ListResponse } from '@/types'
import { HttpError } from '@refinedev/core'
import { createDataProvider, CreateDataProviderOptions} from '@refinedev/rest'

if (!BACKEND_BASE_URL) {
  throw new Error('Backend url not found.')
}

const buildHttpError = async (res: Response): Promise<HttpError | undefined> => {
  let message = 'Request failed'

  try {
    const payload = (await res.json()) as { message?: string }

    if(payload?.message) {
      message = payload?.message
    }

    return {
      message,
      statusCode: res?.status
    }
  } catch (error) {
    // Ignore the errors and returns the default message 
    console.log("Error: ", error);
    
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
    // For functional filters 
    buildQueryParams: async ({resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1
      const pageSize = pagination?.pageSize ?? 10

      const params: Record<string, string | number> = { page, limit: pageSize}

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : ''

        // Convert value to string for query params
        const value = String(filter.value)

        if(resource === 'subjects') {
          if(field === 'departments' || field === 'department' || field === 'departments.name') {
            params.department = value
          }
          if(field === 'name' || field === 'code') {
            params.search = value
          }
        }

        if(resource === 'classes') {
          if(field === 'name') params.search = value
          if(field === 'subject') params.subject = value
          if(field === 'teacher') params.teacher = value
        }
      })
      return params;
    },
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json()

      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json()

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  },

  create: {
    getEndpoint: ({ resource }) => resource,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json?.data ?? [];
    }
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();

      return json.data ?? {};
    }
  }
}

export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options)

// export { dataProvider };