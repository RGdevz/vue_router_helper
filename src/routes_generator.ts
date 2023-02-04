import path from "path";
import * as fs from "fs-extra";
import {generateRoutes} from "./vue-route-generator";






  	async function get_pages_dir_path(){

			const file_path = path.resolve('vue_routes.txt')

			if (!await fs.pathExists(file_path)) throw new Error('please create vue_routes.txt file with the path')

			const paths = await fs.readFile(file_path,'utf8').then(x=>x.trim())

			if (!paths){
			throw new Error('vue_routes.txt is empty')
			}

			if (!await fs.pathExists(paths)){
			throw new Error(`path ${paths} not exits, please enter a relative path`)
			}

			if (!(await fs.stat(paths)).isDirectory()){
			throw new Error('path must be a dir')
			}

			if (path.isAbsolute(paths)){
			throw new Error('please enter  relative path')
			}

			return paths


	  }





	 export async function generate(){

 	const paths = await get_pages_dir_path()



	 const code = generateRoutes({
		importPrefix:`${paths}/`,
		pages: paths // Vue page component directory
		}
		)


		await fs.writeFile(path.resolve('generated_routes.ts'),code,{flag:'w+'})

		console.log('Routes Generated...')

	}



