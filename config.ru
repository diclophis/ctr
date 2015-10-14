
use Rack::Static,
  :urls => [
    "/sound-engine",
    "/javascripts",
    "/images",
    "/index.html",
    "/drone.dae",
    "/drone_color.png"
  ],
  :root => "public"

run lambda { |env|
  [
    302,
    {
      'Location'  => '/index.html',
    },
    StringIO.new("")
  ]
}
