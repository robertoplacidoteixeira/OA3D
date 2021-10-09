class Schrodinger extends RptCommonAncestor{

	beforePrepare() {
		super.beforePrepare();
		this.const = c;
	}

	afterPrepare() {
		super.afterPrepare();
		this.math = new RptMath();
	}

	duringCreate() {
		
	var schrodinger = new function() {
		
		var mt = new RptMath();
		
		var h     = 6.626e-34; // Planck's constant                 
		var h_bar = h / mt.mul(m.complex(2),pi);
		var eps   = 8.854e-12;
		var q     = 1.602e-19;
		var m_p   = 1.2726e-27;
		var m_e   = 9.109e-31;
		var mass  = m_e; //% assuming proton is fixed, neglecting reduced mass. (o.9995m_e)
		var a0    = 4 * pi * eps * mt.power(h_bar / q,2) / mass;
		// var a0    = mul(complex(4),pi,eps,power(h_bar/q,2)/mass;   //% Bohr radius

/*
		// laguerre Calculates associated Laguerre Polynomial value
		laguerre = function(a,b,x) {
			var k = mt.add(a,b);
			for (var i = 1; i <= a; i++) {
				f = mt.diff(function(x){mt.power(x,k)*mt.exp(-y)});
			}
			g = mt.div(mt.mul(power(y,-b),mt.exp(y)),mt.factorial(a));
			L = vpa(subs(g * f,y,x));
		}

		// Legendre polynomial value
		legendre(a,b,x) {
			const y;
			f = mt.power(y**2-1,a);
			var k = mt.add(a,b);
			for (var i = 1; i < k; i++) {
				f = diff(f);
			}
			g = (-1)^b * power(1-y**2,b/2) / (2^a * factorial(a));
			P = vpa(subs(g * f,y,x));
		}
		
		ml() {
			if(!this.matlab) {
				this.matlab {
			
					pdeplot3D = function() {
					}

					createpde = function() {
					}
					
					specifyCoefficients = function() {
					}
					
					meshgrid = function() {
					}
					
					applyBoundaryCondition() {
					}
					
					title() {
					}
				}
			}
			return this.matlab;
		}

		// Solve for eigen energy values and wavefunctions for infinitely deep potential well in 3D
		eigen_box() {
			// eigenV = input('For which eigen energy level do you want to plot? (1,2,..5) : ');
			// cx = (h_bar^2)/(2 * m_e);
			var c = this.const;
			L = 1;
			d = 1;
			var model = this.createpde();

			a = 0;      //% potential

			// //% Boundary conditions

			[x,y,z] = this.ml.meshgrid([-L/2 L/2]);
			x = x(:);
			y = y(:);
			z = z(:);
			K = convhull(x,y,z);
			nodes = [x';y';z'];
			elements = K';
			geometryFromMesh(model,nodes,elements);
			figure('Name','Boundary Conditions');
			pdegplot(model,'FaceLabels','on','FaceAlpha',0.5);
			this.ml.title('Boundary Conditions');
			this.ml.applyBoundaryCondition(model,'dirichlet','Face',1:6,'u',0);

			// //% Specify coefficients

			this.specifyCoefficients(model,'c',1,'a',a,'d',d,'m',0,'f',0);
			//  c is normalized to 1 for easier numerical calculations for MATLAB

			// //% Solve PDE for eigenvalues

			//  generateMesh(model,'Hmax',0.05);
			generateMesh(model);
			evr = [1,200];
			results = solvepdeeig(model,evr);

			// {
			this.pdeplot3D(model,'ColorMapData',results.NodalSolution(:,3),
				'FaceAlpha',0.5);
			// }

			// //% Plot probability distribution

			[X,Y,Z] = meshgrid(-L/2:L/20:L/2,-L/2:L/20:L/2,-L/2:L/20:L/2);
			V = interpolateSolution(results,X,Y,Z,eigenV);
			V = reshape(V,size(X));
			prob = abs(V)**2;

			// {
			// figure('Name','Sliced in x direction');
			colormap jet;
			subplot(2,2,2);
			contourslice(X,Y,Z,V**2,-0.45:0.01:0.45,[],[]);
			this.ml.title(sprintf('Probability Distribution,sliced in x direction for No://%s eigenvalue',num2str(eigenv)));
			xlabel('x'); ylabel('y'); zlabel('z');
			colorbar; view(-11,14); axis equal;

			// figure('Name','Sliced in y direction');
			colormap jet;
			subplot(2,2,3);
			contourslice(X,Y,Z,V**2,[],-0.45:0.01:0.45,[]);
			this.ml.title(sprintf('Probability Distribution,sliced in y direction for No://%s eigenvalue',num2str(eigenv)));
			xlabel('x'); ylabel('y'); zlabel('z');
			colorbar; view(-11,14); axis equal;

			// figure('Name','Sliced in z direction');
			colormap jet;
			subplot(2,2,4);
			contourslice(X,Y,Z,V**2,[],[],-0.45:0.01:0.45);
			this.ml.title(sprintf('Probability Distribution,sliced in z direction for No://%s eigenvalue',num2str(eigenv)));
			xlabel('x'); ylabel('y'); zlabel('z');
			colorbar; view(-11,14); axis equal;
			// }

			xslice = 0;        //% location of y-z planes
			yslice = 0;        //% location of x-z planes
			zslice = 0;        //% location of x-y planes
			
			figure('Name','Probability Distribution');
			slice(X,Y,Z,prob,xslice,yslice,zslice)
			xlabel('x'); ylabel('y'); zlabel('z'); colorbar; daspect([1 1 1]); axis equal;
			this.ml.title(sprintf('Probability Distribution for eigen energy level //%s',num2str(eigenV)));
		}
		
		//  Solve for eigen energy values and wavefunctions for H atom
		eigen_H(eigenV) {
			// eigenV = input('For which eigen energy level do you want to plot? (1,2,..5) : ');
			L = 1;
			r = 0.5;
			//  k = q^2/(4 * pi * eps);
			cx = mt.div(mt.power(h_bar,2),mt.mul(2,mass));
			d = 1;
			var model = this.createpde;
			// //% Potential function
			a = @(location,state)(-1./mt.sqrt((location.x)**2+(location.y)**2+(location.z)**2));
			//  used potential function as (-1/r) for easier numerical calculations
			//  for MATLAB
			// //% Boundary condition
			gm = multisphere(r);
			model.Geometry = gm;
			figure('Name','Boundary Conditions');
			pdegplot(model,'FaceLabels','on','FaceAlpha',0.5);
			this.ml.title('Boundary Conditions');
			this.ml.applyBoundaryCondition(model,'dirichlet','Face',1,'u',0);
			// Specify coefficients
			this.ml.specifyCoefficients(model,'c',1,'a',a,'d',d,'m',0,'f',0);
			//  c is normalized to 1 for easier numerical calculations for MATLAB
			// //% Solve PDE for eigenvalues
			//  generateMesh(model,'Hmax',0.05);
			generateMesh(model);
			evr = [-inf,200];
			results = solvepdeeig(model,evr);
			// //% Plot probability distribution and orbital shape
			[X,Y,Z] = meshgrid(-r:r/10:r,-r:r/10:r,-r:r/10:r);
			V = interpolateSolution(results,X,Y,Z,eigenV);
			V = reshape(V,size(X));
			prob = abs(V)**2;
			xslice = 0;        //% location of y-z planes
			yslice = 0;        //% location of x-z planes
			zslice = 0;        //% location of x-y planes
			figure('Name','Probability Distribution and Orbital Shape');
			subplot(1,2,1);
			slice(X,Y,Z,prob,xslice,yslice,zslice);
			this.ml.title(sprintf('Probability Distribution for eigen energy level //%s',num2str(eigenV)));
			xlabel('x'); ylabel('y'); zlabel('z'); colorbar; daspect([1 1 1]);
			// figure('Name','Orbital Shape');
			subplot(1,2,2);
			iso_val = max(prob,[],'all')-(max(prob,[],'all')-min(prob,[],'all'))*0.85;
			p = patch(isosurface(X,Y,Z,prob,iso_val));
			p.FaceColor = 'red'; p.EdgeColor = 'None';
			this.ml.title(sprintf('Orbital Shape for eigen energy level //%s',num2str(eigenV)));
			daspect([1 1 1]); view(3); camlight;
			xlabel('x'); ylabel('y'); zlabel('z');
		}
		
		//  Finitely deep potential well in 1D
		inf_well_1d_01(Lz) {
			var c = this.const;
			Lz = input('Enter Lz (>0): ');
			m = m_e;
			//  E1_inf = (h_bar * pi/Lz)^2 / (2 * m);
			//  V0 = 10 * E1_inf;
			v0 = input('Enter v0 (>=1.5) : ');      //% = V0/E1_inf
			//  for better visualization v0 >= 1.5
			var eps_linspace = linspace(0,v0,100 * v0+1);
			var lz2 = Lz/2;
			var lz100 = Lz/100;
			z1 = ml.arr(-3 * Lz2,Lz100,-Lz2-Lz100);
			z2 = ml.arr(-Lz2+Lz100,Lz100,Lz2-Lz100);
			z3 = ml.arr(Lz2+Lz100,Lz100,3 * Lz/2);
			z = [z1 z2 z3];
			// //% for symmetric solution
			y1_sym = mt.sqrt(eps)*tan(mt.sqrt(eps)*pi/2);
			y2_sym = mt.sqrt(v0-eps);
			inds_sym = find(mod(mt.sqrt(eps),2) == 1);        //% find discontinuities
			y1_sym(inds_sym) = NaN;
			y2_sym(inds_sym) = NaN;
			eps_linspace(inds_sym) = NaN;
			figure('Name','Finding Energy Levels for Symmetric Solution');
			plot(eps_linspace,y1_sym,'r-',eps_linspace,y2_sym,'b-');
			this.ml.title(sprintf('Finding Energy Levels for Symmetric Solution,when v_0 = //%s',num2str(v0)));
			xlabel('\epsilon'); 
			ylabel('y'); 
			ylim([0 mt.sqrt(v0)]); 
			hold on; 
			grid on; 
			[eps_i,yi] = polyxpoly(eps_linspace,y1_sym,eps_linspace,y2_sym);      //% finding intersections
			scatter(eps_i,yi,'ko');
			legend('LHS','RHS');
			cL = cos(pi * mt.sqrt(eps_i)/2)./mt.exp(-pi * mt.sqrt(v0-eps_i)/2);
			B = mt.sqrt(2./(1+cL**2*(mt.exp(pi * mt.sqrt(v0-eps_i))+mt.exp(-pi * mt.sqrt(v0-eps_i)))./(pi * mt.sqrt(v0-eps_i))+sin(pi * mt.sqrt(eps_i))./(pi * mt.sqrt(eps_i))));
			psi1_sym = B * cL * mt.exp(pi * mt.sqrt(v0-eps_i)*z1/Lz);
			psi2_sym = B * cos(pi * mt.sqrt(eps_i)*z2/Lz);
			psi3_sym = B * cL * mt.exp(-pi * mt.sqrt(v0-eps_i)*z3/Lz);
			psi_sym = [psi1_sym psi2_sym psi3_sym];
			figure('Name','Wave Function and Probability for Symmetric Solution'); hold on;
			var el = eps_i.lenght;
			for (var ni = 1; i <= el; i++} {
					subplot(length(eps_i),2,2 * eps_i.length+1-2 * ni);
					plot(z,psi_sym(ni,:),'r-'); grid on;
					this.ml.title(sprintf('Wave function for \\epsilon = //%s when v_0 = //%s',num2str(eps_i(ni)),num2str(v0)));
					xlabel('z'); ylabel(sprintf('\\psi_{//%s}(z)',num2str(ni)));
					subplot(length(eps_i),2,2 * length(eps_i)+2-2 * ni);
					plot(z,abs(psi_sym(ni,:))**2,'b-'); grid on;
					this.ml.title(sprintf('Probability Distribution for \\epsilon = //%s when v_0 = //%s',num2str(eps_i(ni)),num2str(v0)));
					xlabel('z'); ylabel(sprintf('|\\psi_{//%s}(z)|^{2}',num2str(ni)));
				}
				// //% For antisymmetric solution
				y1_asym = -1 * mt.sqrt(eps)*cot(mt.sqrt(eps)*pi/2);
				y2_asym = mt.sqrt(v0-eps);
				inds_asym = find(mod(mt.sqrt(eps),2) == 0);       //% finding discontinuities
				y1_asym(inds_asym) = NaN;
				y2_asym(inds_asym) = NaN;
				eps_linspace(inds_asym) = NaN;
				figure('Name','Finding Energy Levels for Antisymmetric Solution');
				plot(eps_linspace,y1_asym,'r-',eps_linspace,y2_asym,'b-');
				this.ml.title(sprintf('Finding Energy Levels for Antisymmetric Solution,when v_0 = //%s',num2str(v0)));
				xlabel('\epsilon'); ylabel('y'); ylim([0 mt.sqrt(v0)]); hold on; grid on;
				[eps_j,yj] = polyxpoly(eps_linspace,y1_asym,eps_linspace,y2_asym);        //% finding intersections
				scatter(eps_j,yj,'ko');
				legend('LHS','RHS');
				sL = sin(pi * mt.sqrt(eps_i)/2)./mt.exp(-pi * mt.sqrt(v0-eps_i)/2);
				A = mt.sqrt(2./(1 +
					sL**2 * (mt.exp(pi * mt.sqrt(v0-eps_i))+mt.exp(-pi * mt.sqrt(v0-eps_i)))./(pi * mt.sqrt(v0-eps_i)) -
					sin(pi * mt.sqrt(eps_i))./(pi * mt.sqrt(eps_i))));
				psi1_asym = -A * sL * mt.exp(pi * mt.sqrt(v0-eps_i)*z1/Lz);
				psi2_asym = A * sin(pi * mt.sqrt(eps_i)*z2/Lz);
				psi3_asym = A * sL * mt.exp(-pi * mt.sqrt(v0-eps_i)*z3/Lz);
				psi_asym = [psi1_asym psi2_asym psi3_asym];
				figure('Name','Wave Function and Probability for Antisymmetric Solution'); hold on;
				var el = eps_j.length;
				for for (var nj; nj <= 1; el) {
					subplot(el,2,2 * el + 1 - 2 * nj);
					plot(z,psi_asym(nj,:),'r-'); 
					grid on;
					this.ml.title(sprintf('Wave function for \\epsilon = //%s when v_0 = //%s',num2str(eps_j(nj)),num2str(v0)));
					xlabel('z');
					ylabel(sprintf('\\psi_{//%s}(z)',num2str(nj)));
					subplot(length(eps_j),2,2 * length(eps_j)+2-2 * nj);
					plot(z,abs(psi_asym(nj,:))**2,'b-'); 
					grid on;
					this.ml.title(sprintf('Probability Distribution for \\epsilon = //%s when v_0 = //%s',num2str(eps_j(nj)),num2str(v0)));
					xlabel('z'); 
					ylabel(sprintf('|\\psi_{//%s}(z)|^{2}',num2str(nj)));
				}
			}
		}	

		// Infinitely deep potential well in 1D
		inf_well_1d_02(Lz) { // Lz > 0
			var mt = this.math; 
			var c = this.const;
			z = 0:Lz/1000:Lz;
			n = 1:5;
			E = zeros(length(n),length(z));
			psi_z = zeros(length(n),length(z));
			prob_z = zeros(length(n),length(z));
			// Plotting energy levels
			figure('Name','Energy Levels'); 
			hold on;
			for (var nE = 1; nE < n.lenght; i++) {
				E_nE = mt.power((h_bar * nE * pi/Lz),2) / (2 * mass);
				E(nE,:) = E_nE;
				plot(z,E(nE,:),'r-');
				text(max(z),max(E(nE,:)),sprintf('n = //%s',num2str(nE)));
			}
			hold off; 
			grid on;
			this.ml.title('Energy Levels'); xlabel('z'); ylabel('Energy');
			figure('Name','Wave Function and Probability'); 
			hold on;
			for (var nz = 1; nz < n.lenght; nz++) {
				psi_nz = mt.sqrt(2/Lz)*sin(nz * pi * z/Lz);
				psi_z(nz,:) = psi_nz;
				subplot(length(n),2,2 * length(n)+1-2 * nz);
				plot(z,psi_nz,'b-');
				grid on;
				this.ml.title(sprintf('Wave function for n = //%s',num2str(nz)));
				xlabel('z'); ylabel(sprintf('\\psi_{//%s}(z)',num2str(nz)));
				text(max(z),max(psi_nz),sprintf('n = //%s',num2str(nz)));
				prob_nz = abs(psi_nz)**2;
				prob_z(nz,:) = prob_nz;
				subplot(length(n),2,2 * length(n)+2-2 * nz);
				plot(z,prob_nz,'g-');
				grid on;
				this.ml.title(sprintf('Probability Distribution for n = //%s',num2str(nz)));
				xlabel('z'); ylabel(sprintf('|\\psi_{//%s}(z)|^{2}',num2str(nz)));
				text(max(z),max(prob_nz),sprintf('n = //%s',num2str(nz)));
			} 
			hold off;
		}
		*/

		radialWaveFunction(n,l,r) {
			return	
				mt.mul(
					mt.sqrt(div(mt.factorial(n-l-1),mt.mul(2,n,mt.power(mt.factorial(mt.add(n,1)),3)))),
					mt.power(mt.div(2,mt.mul(n,a0)),mt.div(mt.add(l,3),2)), 
					mt.laguerre(mt.add(n,l),mt.add(mt.mul(2,l),1),mt.div(mt.mul(2,r),mt.mul(n,a0))),
					mt.power(R,l),
					mt.exp(div(mt.neg(R),mt.mul(n,a0)))
				);
		}
	
		sphericalHarmonics(signal,l,ml,theta,phi) {
			var aml = mt.abs(ml);
			return
				mt.mul(
					mt.sqrt(
						mt.div(
							mt.mul(mt.add(mt.mul(2,l),1),mt.factorial(mt.sub(l,aml))),
							mt.mul(4,pi,mt.factorial(l+aml))
					),
					mt.legendreQ(l,aml,mt.cos(theta)),
					mt.exp(mt.mul(signal,complex(1,1),aml,phi)
				);
		}

		psi(rwf,ml,theta,phi) {
			if (ml == 0) return mt.mul(rwf,sphericalHarmonics(1,l,ml,theta,phi));
			pos = sphericalHarmonics(1,l,ml,theta,phi);
			neg = sphericalHarmonics(-1,l,ml,theta,phi);
			aux = ml > 0 ? mt.add(pos,neg)) : mt.mul(complex(1,1),mt.sub(pos,neg));
			return mt.div(mt.mul(rwf,aux),mt.sqrt(2));
		}

		// h_wave_f Calculates Hydrogen atom wave function
		waveFunctionHidrogen = function(n,l,ml,R,theta,phi) {
			return this.psi(this.radialWaveFunction(n,l,R),ml,theta,phi);
		}		
		
		// Infinitely deep potential well in 3D
		inf_well_3d(Lx,Ly,Lz,nx,ny,nz) {
			/*
			Lx = input('Enter Lx (>0): ');
			Ly = input('Enter Ly (>0): ');
			Lz = input('Enter Lz (>0): ');
			nx = input('Enter nx (1,2,..): ');
			ny = input('Enter ny (1,2,..): ');
			nz = input('Enter nz (1,2,..): ');
			*/
			x = ml.arr(0,Lx/100,Lx);
			y = ml.arr(0,Ly/100,Ly);
			z = ml.arr(0,Lz/100,Lz);
			[X,Y,Z] = meshgrid(x,y,z);
			// Plotting probability distribution
			figure('Name','Probability Distribution');
			psi_xyz = 
				mt.sqrt(mt.div(8,mt.mul(Lx,Ly,Lz)))*
				mt.sin(mt.mul(nx,pi,mt.div(X/Lx)))*
				sin(ny * pi * Y/Ly)*
				sin(nz * pi * Z/Lz);
			prob_xyz = abs(psi_xyz)**2;

			//  slice 1

			xslice = Lx/2;        //% location of y-z planes
			yslice = Ly/2;        //% location of x-z planes
			zslice = Lz/2;        //% location of x-y planes

			slice(X,Y,Z,prob_xyz,xslice,yslice,zslice)
			
			xlabel('x'); ylabel('y'); zlabel('z'); colorbar; daspect([1 1 1]);
			this.ml.title(sprintf('Probability Distribution for n_x = //%s,n_y = //%s,n_z = //%s',num2str(nx),num2str(ny),num2str(nz)));
		}
		
		//  Hydrogen atom orbitals
		atomHidrogen = function(n,l,ml) {
			/*
			n = input('Enter n (>= 1 ; a positive integer): ');      //% >= 1
			l = input('Enter l (0 <= l <= n-1 ; a non-negative integer): ');      //% 0 <= l < n
			ml = input('Enter ml (-l <= ml <= +l ; an integer): ');      //% -l <= ml <= l
			*/
			var c = this.const;
			//Plotting energy levels
			n_max = 5;
			z_E = 0:0.01:1;
			E = zeros(n_max,z_E.length);
			figure('Name','Energy Levels'); 
			hold on;
			for (var nE = 1; nE <= n_max; nE++) {
				E_nE = mt.mul(mt.neg(mass),mt.div(mt.power(mt.div(mt.power(q,2),mt.mul(pi,eps,h_bar,nE)),2),32));
				E(nE,:) = E_nE;
				plot(z_E,E(nE,:),'r-');
				text(max(z_E),max(E(nE,:)),sprintf('n = //%s',num2str(nE)));
			}	
			hold off;
			grid on;
			this.ml.title('Energy Levels'); ylabel('Energy');

			// //% Plotting probability distributions and orbital shapes

			const r_max = 120e-12;        //% Van der Vaal's radius of Hydrogen
			const dp = 15;
			
			const aux = r_max / dp;
			
			for(var x = -r_max; x <= r_max, x += aux) {
				for(var y = -r_max; y <= r_max, y += aux) {
					for(var z = -r_max; z <= r_max, z += aux) {
						const x2 = mt.power(x,2);
						const y2 = mt.power(y,2);
						const z2 = mt.power(z,2);
						const r = mt.sqrt(mt.add(x2,y2,z2);
						const theta = Math.atan2(mt.sqrt(mt.add(x2,y2)),z);
						const phi = mt.atan2(y,x);
						var psi = this.waveFunctionHidrogen(n,l,ml,r,theta,phi);
						var prob = mt.power(abs(psi),2);
					}
				}
			}

			//  slice 1
			xslice = 0; //% location of y-z planes
			yslice = 0; //% location of x-z planes
			zslice = 0; //% location of x-y planes
			
			figure('Name','Probability Distribution');
			subplot(1,2,1);
			slice(X,Y,Z,prob,xslice,yslice,zslice)
			xlabel('x'); ylabel('y'); zlabel('z'); colorbar; daspect([1 1 1]);
			this.ml.title(sprintf('Probability Distribution for n = //%s,l = //%s,ml = //%s',num2str(n),num2str(l),num2str(ml)));


			// figure('Name','Orbital Shape');
			subplot(1,2,2);
			iso_val = max(prob,[],'all')-(max(prob,[],'all')-min(prob,[],'all'))*0.85;
			p = patch(isosurface(X,Y,Z,prob,iso_val));
			p.FaceColor = 'red'; 
			p.EdgeColor = 'None';
			daspect([1 1 1]); 
			view(3); 
			camlight;
			xlabel('x'); ylabel('y'); zlabel('z');
			this.ml.title(sprintf('Orbital Shape for n = //%s,l = //%s,ml = //%s',num2str(n),num2str(l),num2str(ml)));
		}
	}();
}
