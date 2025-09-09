# postinstall script for pywin32
#
# copies pywintypesXX.dll and pythoncomXX.dll into the system directory,
# and creates a pth file
import argparse
import glob
import os
import shutil
import sys
import sysconfig
import tempfile
import winreg

tee_f = open(
    os.path.join(
        tempfile.gettempdir(),  # Send output somewhere so it can be found if necessary...
        "pywin32_postinstall.log",
    ),
    "w",
)


class Tee:
    def __init__(self, file):
        self.f = file

    def write(self, what):
        if self.f is not None:
            try:
                self.f.write(what.replace("\n", "\r\n"))
            except OSError:
                pass
        tee_f.write(what)

    def flush(self):
        if self.f is not None:
            try:
                self.f.flush()
            except OSError:
                pass
        tee_f.flush()


sys.stderr = Tee(sys.stderr)
sys.stdout = Tee(sys.stdout)

com_modules = [
    # module_name,                      class_names
    ("win32com.servers.interp", "Interpreter"),
    ("win32com.servers.dictionary", "DictionaryPolicy"),
    ("win32com.axscript.client.pyscript", "PyScript"),
]

# Default flags
silent = 0
verbose = 1

root_key_name = "Software\\Python\\PythonCore\\" + sys.winver

# ... (rest of file unchanged until main()) ...

def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description="""A post-install script for the pywin32 extensions.

    * Typical usage:

    > python -m pywin32_postinstall -install

    * or (shorter but you don't have control over which python environment is used)

    > pywin32_postinstall -install

    You need to execute this script, with a '-install' parameter,
    to ensure the environment is setup correctly to install COM objects, services, etc.
    """,
    )
    parser.add_argument(
        "-install",
        default=False,
        action="store_true",
        help="Configure the Python environment correctly for pywin32.",
    )
    parser.add_argument(
        "-remove",
        default=False,
        action="store_true",
        help="Try and remove everything that was installed or copied.",
    )
    parser.add_argument(
        "-wait",
        type=int,
        help="Wait for the specified process to terminate before starting.",
    )
    parser.add_argument(
        "-silent",
        default=False,
        action="store_true",
        help='Don\'t display the "Abort/Retry/Ignore" dialog for files in use.',
    )
    parser.add_argument(
        "-quiet",
        default=False,
        action="store_true",
        help="Don't display progress messages.",
    )
    parser.add_argument(
        "-destination",
        default=sysconfig.get_paths()["platlib"],
        type=verify_destination,
        help="Location of the PyWin32 installation",
    )

    args = parser.parse_args()

    if not args.quiet:
        print(f"Parsed arguments are: {args}")

    if not args.install ^ args.remove:
        parser.error("You need to either choose to -install or -remove!")

    if args.wait is not None:
        try:
            os.waitpid(args.wait, 0)
        except OSError:
            # child already dead
            pass

    # remove unused variables: silent and verbose reassignment is enough
    if args.install:
        install(args.destination)

    if args.remove:
        uninstall(args.destination)


if __name__ == "__main__":
    main()
