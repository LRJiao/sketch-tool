// Copyright (c) 2023 John Skinner
// All rights reserved.

//     Redistribution and use in source and binary forms, with or without
// modification, are permitted without any need to contact the author.
import '@kitware/vtk.js/Rendering/Profiles/Geometry'
import '@kitware/vtk.js/Rendering/Profiles/Volume'
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkCubeAxesActor from '@kitware/vtk.js/Rendering/Core/CubeAxesActor';
import vtkSphereMapper from '@kitware/vtk.js/Rendering/Core/SphereMapper';
import vtkLineSource from '@kitware/vtk.js/Filters/Sources/LineSource';
import vtkPolygon from '@kitware/vtk.js/Common/DataModel/Polygon';
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource';

export class ConeView
{

    
    renderer = vtkRenderer.newInstance();
    vtkRenderWindow = vtkRenderWindow.newInstance();
    //cubeAxes = vtkCubeAxesActor.newInstance();

    Initialize(Div, x, y, z)
    {
        this.windowWidth = Div.clientWidth;
        this.windowHeight = Div.clientHeight;
        

        const initialValues = {background: [x, y, z]};
        this.openglRenderWindow = vtkOpenGLRenderWindow.newInstance(initialValues);
        this.openglRenderWindow.setContainer(Div);
        this.openglRenderWindow.setSize(this.windowWidth, this.windowHeight);
        this.vtkRenderWindow.addView(this.openglRenderWindow);
        const coneSource = vtkConeSource.newInstance({height:5});
        const sphereSource = vtkSphereSource.newInstance({
            height: 1.0,
            phiResolution: 360,
            thetaResolution: 360,
          });
        const a2 = vtkActor.newInstance();
        const m2 = vtkMapper.newInstance();
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        a2.setMapper(m2);
        actor.setMapper(mapper);
        m2.setInputConnection(sphereSource.getOutputPort());
        mapper.setInputConnection(coneSource.getOutputPort());
        this.vtkRenderWindow.addRenderer(this.renderer);
        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setInteractorStyle(
            vtkInteractorStyleTrackballCamera.newInstance()
        );
        interactor.setView(this.openglRenderWindow);
        interactor.initialize();
        interactor.bindEvents(Div);
        //this.cubeAxes.setCamera(this.renderer.getActiveCamera());
        //this.cubeAxes.setDataBounds(actor.getBounds());
        this.renderer.addActor(actor);
        this.renderer.addActor(a2);
        //this.renderer.addActor(this.cubeAxes);
        this.renderer.resetCamera();
        this.vtkRenderWindow.render();
    }

    stringToColour = (str) => {
        let hash = 0;
        str.split('').forEach(char => {
          hash = char.charCodeAt(0) + ((hash << 5) - hash)
        })
        let colour = '#'
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xff
          colour += value.toString(16).padStart(2, '0')
        }
        return colour
      }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }
      
    Add(param, Div) {
        let params;
        if(param != null) {
            params = param.split("(");
        }
        else {
            return;
        }
        let sel = params[0];
        let color = this.stringToColour(param);
        let rgb = this.hexToRgb(color);
        console.log(params[0]);
        if(sel == 'pnt') {
            let coord = params[1].split(",");
            const sphereSource = vtkSphereSource.newInstance({
                height: 1.0,
                phiResolution: 360,
                thetaResolution: 360,
              });
            sphereSource.setCenter([parseInt(coord[0]),parseInt(coord[1]),parseInt(coord[2])]);
            const actor = vtkActor.newInstance();
            actor.getProperty().setColor((rgb.r)/255,(rgb.g)/255,(rgb.b)/255);
            const mapper = vtkMapper.newInstance();
            mapper.setInputConnection(sphereSource.getOutputPort());
            actor.setMapper(mapper);
            this.renderer.addActor(actor);
            this.vtkRenderWindow.addRenderer(this.renderer);
            this.renderer.resetCamera();
            this.vtkRenderWindow.render();
        
        }
        else if(sel == 'seg') {
            let coord = params[1].split(",");
            let icoord = parseInt(coord);
            const lineSource = vtkLineSource.newInstance();
            lineSource.setPoint1([parseInt(coord[0]), parseInt(coord[1]), parseInt(coord[2])]);
            lineSource.setPoint2([parseInt(coord[3]), parseInt(coord[4]), parseInt(coord[5])]);
            const actor = vtkActor.newInstance();
            actor.getProperty().setColor((rgb.r)/255,(rgb.g)/255,(rgb.b)/255);
            const mapper = vtkMapper.newInstance();
            mapper.setInputConnection(lineSource.getOutputPort());
            actor.setMapper(mapper);
            this.renderer.addActor(actor);
            this.vtkRenderWindow.addRenderer(this.renderer);
            this.renderer.resetCamera();
            this.vtkRenderWindow.render();
        }
        else if(sel == 'ply') {
            let coord = params[1].split(",");
            const polySource = vtkPolygon.newInstance();
            const actor = vtkActor.newInstance();
            actor.getProperty().setColor(parseInt(coord[0]) + parseInt(coord[3]), parseInt(coord[1]) + parseInt(coord[4]), parseInt(coord[2]) + parseInt(coord[5]));
            const mapper = vtkMapper.newInstance();
            actor.setMapper(mapper);
            this.renderer.addActor(actor);
            this.vtkRenderWindow.addRenderer(this.renderer);
            this.renderer.resetCamera();
            this.vtkRenderWindow.render();
            

        }
        else if(sel == 'cube') {
            let coord = params[1].split(",");
            const cubeSource = vtkCubeSource.newInstance();
            let centerX = (8*parseInt(coord[0]) + 4*parseInt(coord[3]) + 4*parseInt(coord[6]) + 4*parseInt(coord[9]))/8;
            let centerY = (8*parseInt(coord[1]) + 4*parseInt(coord[4]) + 4*parseInt(coord[7]) + 4*parseInt(coord[10]))/8;
            let centerZ = (8*parseInt(coord[2]) + 4*parseInt(coord[5]) + 4*parseInt(coord[8]) + 4*parseInt(coord[11]))/8
            cubeSource.setCenter([parseInt(centerX),parseInt(centerY),parseInt(centerZ)]);
            const actor = vtkActor.newInstance();
            actor.getProperty().setColor((rgb.r)/255,(rgb.g)/255,(rgb.b)/255);
            const mapper = vtkMapper.newInstance();
            mapper.setInputConnection(cubeSource.getOutputPort());
            actor.setMapper(mapper);
            this.renderer.addActor(actor);
            this.vtkRenderWindow.addRenderer(this.renderer);
            this.renderer.resetCamera();
            this.vtkRenderWindow.render();

        }
        const coneSource = vtkConeSource.newInstance({height: 5});
        coneSource.setCenter([1,1,1]);
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance();
        
        mapper.setInputConnection(coneSource.getOutputPort());
        actor.setMapper(mapper);
        //this.cubeAxes.setCamera(this.renderer.getActiveCamera());
        //this.cubeAxes.setDataBounds(actor.getBounds());
        this.renderer.addActor(actor);
        //this.renderer.addActor(this.cubeAxes);
        this.vtkRenderWindow.addRenderer(this.renderer);
        this.vtkRenderWindow.render();
    }
}

