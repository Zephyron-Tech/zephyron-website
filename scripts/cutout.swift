// Cuts the main subject out of a photo with Apple's Vision framework
// (the same "lift subject" model as Photos) and saves it as a PNG with alpha.
// macOS 14+.
//
//   swift scripts/cutout.swift IN.jpg OUT.png
//
// Feed the result to scripts/retro-print.py.

import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
    FileHandle.standardError.write("usage: swift cutout.swift IN OUT.png\n".data(using: .utf8)!)
    exit(2)
}

let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let image = CIImage(contentsOf: input) else {
    FileHandle.standardError.write("cannot read \(input.path)\n".data(using: .utf8)!)
    exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: image)
try handler.perform([request])

guard let result = request.results?.first, !result.allInstances.isEmpty else {
    FileHandle.standardError.write("no subject found in \(input.path)\n".data(using: .utf8)!)
    exit(1)
}

let buffer = try result.generateMaskedImage(
    ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
let masked = CIImage(cvPixelBuffer: buffer)
let context = CIContext()
try context.writePNGRepresentation(
    of: masked, to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("\(output.path): \(Int(masked.extent.width))x\(Int(masked.extent.height)), \(result.allInstances.count) instance(s)")
